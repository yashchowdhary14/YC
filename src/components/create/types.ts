export type CreateMode = "post" | "reel" | "video" | "story" | "live";

export type FinalizedCreateData = {
  mode: CreateMode;
  files: File[];
  caption: string;
  tags: string[];
  mentions: string[];
  location?: string;
  collaborators: string[];
<<<<<<< HEAD
  taggedUsers: Record<string, string[]>;
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
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
<<<<<<< HEAD
    category?: string;
=======
>>>>>>> b0a2dda0c8eebed76a91c0a434503dc6eb3d721c
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
