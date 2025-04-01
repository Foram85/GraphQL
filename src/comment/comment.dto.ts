import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateComment {
  @Field()
  content: string;

  @Field(() => ID)
  postId: string;
}
