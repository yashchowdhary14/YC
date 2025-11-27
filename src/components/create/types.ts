export type CreateMode = "post" | "reel" | "video" | "story" | "live";

export type FinalizedCreateData = {
  mode: CreateMode;
  files: File[];
  caption: string;
  tags: string[];
  mentions: string[];
  location?: string;
  collaborators: string[];
  taggedUsers: Record<string, string[]>;
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
    category?: string;
  };
};

export type SimulatedUploadResult = {
  id: string;
  mediaUrls: string[];
  thumbnailUrl: string;
  duration?: number;
  mode: CreateMode;
  metadata: FinalizedCreateData;
};
