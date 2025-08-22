import { IsString, IsOptional, IsIn, IsInt, Min } from "class-validator";

export class CreateArticleDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

export class GetArticleListDto {
  @IsOptional()
  @IsIn(["recent", "old"])
  orderBy?: "recent" | "old";

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number;
}
