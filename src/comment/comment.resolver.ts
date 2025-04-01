import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { CreateComment } from './comment.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/user/gql-auth.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Mutation(() => Comment)
  createComment(@Context('req') req, @Args('input') input: CreateComment) {
    return this.commentService.create(req.user.id, input);
  }

  @Query(() => [Comment])
  async getCommentsbyUser(
    @Context('req') req,
    @Args('userId', { nullable: true }) userId?: string,
  ) {
    if (userId) {
      return await this.commentService.get(req.user.id);
    }
    return await this.commentService.getAll();
  }

  @Mutation(() => String)
  deleteComment(@Context('req') req, @Args('id') id: string) {
    return this.commentService.delete(req.user.id, id);
  }
}
