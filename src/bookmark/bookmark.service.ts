import { Injectable } from "@nestjs/common";
import { CreateBookmarkDto, EditBookmarkDto } from "./dto";

@Injectable()
export class BookmarkService {
  getBookmarks(userId: number) {}

  createBookmark(userId: number, dto: CreateBookmarkDto) {}

  getBookmarkById(userId: number, bookmarkId: number) {}

  editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {}

  deleteBookmarkById(userId: number, bookmarkId: number) {}
}
