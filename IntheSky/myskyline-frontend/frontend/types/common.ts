export interface IUseAPIArgs<TData> {
  statusCode: number;
  message: string;
  data: TData;
}

export interface IThumbnail {
  postId: number;
  uploadUrl: string;
  uploadPath: string;
  isAccept: string;
  registerDate: string;
  postName: string;
  location: string;
  userId: number;
  isDel: string;
}

export interface ILogin {
  userId: number;
  token: string;
}
