export interface Member {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberInput {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface MemberUpdateInput {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
}
