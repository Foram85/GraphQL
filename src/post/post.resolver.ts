import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { CreatePost, FilterPost, Pagination } from './post.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/user/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  getPost(
    @Args('filter', { nullable: true }) filter?: FilterPost,
    @Args('pagination', { nullable: true }) pagination?: Pagination,
    @Args('id', { nullable: true }) id?: string,
  ) {
    if (id) {
      return [this.postService.getById(id)];
    }
    return this.postService.getAll(filter, pagination);
  }

  @Mutation(() => Post)
  createPost(@Context('req') req, @Args('input') input: CreatePost) {
    return this.postService.create(req.user.id, input);
  }

  @Mutation(() => String)
  deletePost(@Context('req') req, @Args('id') id: string) {
    return this.postService.delete(req.user.id, id);
  }
}
