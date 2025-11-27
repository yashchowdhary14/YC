
export type CreateMode = "post" | "reel" | "video" | "story" | "live";

export type FinalizedCreateData = {
  mode: CreateMode;
  files: File[];
  caption: string;
  tags: string[];
  mentions: string[];
  location?: string;
  collaborators: string[];
  productTags: string[];
  accessibility: {
    alt: string[];
  };
  settings: {
    visibility?: "public" | "unlisted" | "private";
    hideLikes?: boolean;
    disableComments?: boolean;
    disableRemix?: boolean;
    storyAudience?: "everyone" | "close-friends" | "custom";
  };
};
