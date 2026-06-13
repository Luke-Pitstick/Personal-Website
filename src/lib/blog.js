const postModules = import.meta.glob('../content/blog/*.md');

const getSlugFromPath = (path) => path.split('/').pop()?.replace(/\.md$/, '') ?? '';

const getPostTime = (post) => {
  if (!post.date) {
    return 0;
  }

  const time = new Date(post.date).getTime();
  return Number.isNaN(time) ? 0 : time;
};

const normalizePost = (path, module) => {
  const frontmatter = module.frontmatter ?? {};
  const slug = frontmatter.slug ?? getSlugFromPath(path);

  return {
    slug,
    url: `/blog/${slug}/`,
    title: frontmatter.title ?? 'Untitled Note',
    description: frontmatter.description ?? '',
    date: frontmatter.date ?? null,
    draft: Boolean(frontmatter.draft),
    Content: module.Content,
  };
};

export const getBlogPosts = async ({ includeDrafts = false } = {}) => {
  const posts = await Promise.all(
    Object.entries(postModules).map(async ([path, loadPost]) => normalizePost(path, await loadPost())),
  );

  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => getPostTime(b) - getPostTime(a));
};

export const formatBlogDate = (date) => {
  if (!date) {
    return 'Undated';
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Undated';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
    year: 'numeric',
  }).format(parsedDate);
};
