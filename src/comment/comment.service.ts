import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
import { CreateComment } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private repo: Repository<Comment>,
    private userService: UserService,
    private postService: PostService,
  ) {}

  async create(userId: string, dto: CreateComment): Promise<Comment> {
    const post = await this.postService.getById(dto.postId);
    const newComment = this.repo.create({ ...dto, user: { id: userId }, post });
    return await this.repo.save(newComment);
  }

  async get(userId: string): Promise<Comment[]> {
    await this.userService.findOne(userId);
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  async getAll(): Promise<Comment[]> {
    return await this.repo.find();
  }

  async delete(userId: string, id: string): Promise<string> {
    const comment = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (comment.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }
    await this.repo.delete({ id });
    return 'comment deleted';
  }
}
