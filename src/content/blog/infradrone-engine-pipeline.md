---
title: InfraDrone Engine Pipeline
description: How InfraDrone turns drone imagery into structured road-damage records with detection, segmentation, skeletonization, branch merging, and measurement.
date: 2026-06-13
draft: false
---

InfraDrone is an image-processing and machine-learning pipeline for finding road damage from drone or camera imagery. The engine starts with a raw frame, cleans it up for model inference, detects candidate damage regions, segments the exact crack or pothole shape, and then converts those model outputs into structured damage records.

The important part is that the engine does not stop at "there is a crack somewhere in this box." Detection gives the rough location, but segmentation and post-processing are what make the result useful. Those stages estimate crack geometry, split and merge branches, classify the crack subtype, and calculate measurements like length, thickness, and area.

## The Pipeline

At a high level, the engine moves through nine stages:

| Step | Purpose |
| --- | --- |
| 1 | Load a frame from the input queue or image source. |
| 2 | Preprocess the image for road-surface contrast and model input size. |
| 3 | Run YOLO detection to find cracks and potholes as bounding boxes. |
| 4 | Crop each detected region so segmentation only sees the relevant area. |
| 5 | Run YOLO segmentation to create binary masks for each damage region. |
| 6 | Skeletonize the masks and analyze crack branches. |
| 7 | Merge branch fragments that are close and directionally aligned. |
| 8 | Measure dimensions and classify the damage subtype. |
| 9 | Return a structured damage record for downstream reporting. |

In code, the top-level engine wires together `DetectionEngine` and `SegmentationEngine`. The current implementation can be summarized like this:

```text
I -> I' -> D -> {Ci} -> {Mi} -> {Si} -> {Bi} -> Damage
```

`I` is the original image, `I'` is the preprocessed image, `D` is the detection output, `Ci` are cropped damage regions, `Mi` are segmentation masks, `Si` are skeletonized masks, and `Bi` are the final crack branches.

## Preprocessing

The preprocessing step makes road texture easier for the models to read. A raw frame can have glare, shadows, compression noise, and inconsistent resolution, so each image is normalized before inference.

The current preprocessing function does three things:

- resizes the image to the model input size;
- applies CLAHE in LAB color space to improve local contrast;
- applies bilateral filtering to denoise while preserving edges.

I think of it as:

```text
I' = Denoise(CLAHE(Resize(I)))
```

This is practical more than fancy. Cracks are thin, low-contrast structures, so increasing local contrast before detection and segmentation helps the model see the features that matter.

## Detection

The detection stage uses a YOLO model trained to find two high-level classes: `crack` and `pothole`.

For a preprocessed image, the detector returns bounding boxes with coordinates, confidence, and predicted damage type. Detections below the configured confidence threshold are removed. The remaining boxes are cropped from the image and passed into segmentation.

This two-model design keeps the segmentation problem smaller. Instead of asking the segmentation model to understand the whole drone image, the detector narrows the input down to likely damage regions first.

## Segmentation

The segmentation model returns a binary mask for each detected damage crop. Each mask is thresholded and skeletonized. The mask keeps the full damaged area, while the skeleton reduces the crack to a one-pixel-wide centerline.

That centerline is much easier to reason about because crack length, direction, endpoints, and branches become graph-like properties instead of blob properties.

![Skeletonized crack mask](https://np69tokggkswfstp.public.blob.vercel-storage.com/website/blog/infradrone-pipeline/skeletonized-crack-mask.png)

*The full segmentation mask is reduced to a one-pixel-wide centerline while preserving the crack shape.*

## Branch Detection

Once the crack is skeletonized, the engine searches for branch points and endpoints. A branch point is a skeleton pixel with at least three neighboring skeleton pixels in its 8-connected neighborhood.

The engine dilates the branch-point region, removes it from the skeleton, and labels the remaining connected components. Each component becomes a candidate branch. Very short components are removed so tiny artifacts do not become reported cracks.

![Skeleton split into branch segments](https://np69tokggkswfstp.public.blob.vercel-storage.com/website/blog/infradrone-pipeline/branch-segments.png)

*Junction pixels are removed so connected-component labeling can isolate each branch.*

![Colored branch labels](https://np69tokggkswfstp.public.blob.vercel-storage.com/website/blog/infradrone-pipeline/branch-labels.png)

*Each surviving component is treated as a separate branch candidate.*

## Branch Angles and Merging

Cracks often get split into multiple pieces because segmentation masks are imperfect. The engine tries to reconnect branch fragments when they are close together and point in roughly the same direction.

For each branch, the overall axis angle is estimated from the farthest pair of endpoints. The angle is treated as undirected, so 0 degrees and 180 degrees are equivalent. For local merge checks, the engine also estimates endpoint direction with PCA over nearby skeleton pixels. That gives a better tangent estimate at the endpoint than using the whole branch.

![Estimated branch axes](https://np69tokggkswfstp.public.blob.vercel-storage.com/website/blog/infradrone-pipeline/branch-axes.png)

*The red guide lines show the direction used for classification and merge checks.*

Two branches can merge if their closest endpoint distance and local angle difference are below the configured thresholds. When more than one pair is eligible, the engine chooses the lowest score:

```text
score = endpoint_distance + angle_difference
```

The selected pair is merged by drawing a bridge between the closest endpoints, recomputing the skeleton, and repeating until no more pairs qualify.

![Final branch groups after merging](https://np69tokggkswfstp.public.blob.vercel-storage.com/website/blog/infradrone-pipeline/final-branch-groups.png)

*The numbered branches are the geometry passed into measurement and subtype classification.*

## Measurements

The final branch mask and skeleton are converted into physical measurements. Right now the engine stores these in pixel units unless a real-world scale ratio is configured.

Thickness is estimated with a distance transform. For each skeleton pixel, the distance transform gives the distance to the nearest mask boundary. Doubling that value gives a local width estimate, and averaging across the skeleton gives the crack's average thickness.

Length is currently estimated as the Euclidean distance between the farthest endpoint pair. That works well for mostly straight branches. A future improvement would be to measure length along the skeleton path itself, especially for curved cracks.

Area is the number of foreground pixels in the mask. If the engine has a pixel-to-real-world conversion ratio, thickness, length, and area can be scaled into centimeters or inches.

## Subtype Classification

After the geometry is measured, the engine assigns a crack subtype. The current rule is intentionally explainable:

- if the branch network has many connections, classify it as alligator cracking;
- otherwise classify by orientation angle;
- branches above the angle threshold are longitudinal;
- branches below the angle threshold are transverse.

The subtype comes from skeleton shape and image orientation instead of hiding the decision in another model.

## Output Record

Each final result becomes a `Damage` object. The record includes:

- a unique ID;
- the final mask and skeleton;
- the damage type, either crack or pothole;
- confidence;
- thickness, length, and area;
- subtype;
- stress range;
- number of branch connections;
- severity placeholder.

The severity field is currently set to zero. The planned direction is to combine measured damage geometry with road-class stress information and fatigue-growth modeling.

## Severity Direction

The project is set up for a later severity layer based on fatigue crack growth. The intended model is Paris' Law, which relates crack growth rate to stress-intensity range:

```text
da / dN = C(delta K)^m
```

In the engine, the `StressRange` enum gives a first pass at road class, from residential roads up through freeways.

The idea is that the same observed crack should not always mean the same priority. A crack on a low-traffic residential road and a similar crack on a freeway should be treated differently because the expected stress cycles and consequences are different.

## Current Limitations

The current pipeline works as an end-to-end analysis path, but a few areas still need to be tightened:

- severity scoring is still a placeholder;
- backend persistence is stubbed out;
- the frame listener is moving from a database-style queue to Redis;
- length is measured endpoint-to-endpoint instead of along the skeleton path;
- real-world pixel scale needs to come from camera altitude, calibration, or metadata before centimeter-level dimensions are meaningful.

## Why This Shape Matters

InfraDrone's pipeline is built around a simple split: use detection to find where damage probably is, then use segmentation and image processing to understand what that damage actually looks like.

The screenshots show why the post-processing matters. The raw mask is useful, but the skeleton, branches, angles, and merged crack paths are what turn a model prediction into something that can be measured and reported.
