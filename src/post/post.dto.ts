import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreatePost {
  @Field()
  title: string;

  @Field()
  content: string;
}

@InputType()
export class Pagination {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number;
}

@InputType()
export class FilterPost {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}
