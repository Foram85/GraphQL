import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePost, FilterPost, Pagination } from './post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repo: Repository<Post>,
  ) {}

  async create(userId: string, dto: CreatePost): Promise<Post> {
    const newPost = this.repo.create({ ...dto, user: { id: userId } });
    return await this.repo.save(newPost);
  }

  async getAll(filter: FilterPost, pagination: Pagination): Promise<Post[]> {
    const where: FindManyOptions<Post>['where'] = {};
    if (filter?.title) {
      where.title = Like(`%${filter.title}%`);
    }
    if (filter?.content) {
      where.content = Like(`%${filter.content}%`);
    }
    return await this.repo.find({
      where,
      take: pagination?.limit, // Limit number of records
      skip: pagination?.skip,
    });
  }

  async getById(id: string): Promise<Post> {
    return await this.repo.findOneBy({ id });
  }

  async delete(userId: string, id: string): Promise<string> {
    const post = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }
    await this.repo.delete(id);
    return 'post deleted';
  }
}
