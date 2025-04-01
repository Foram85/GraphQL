import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { Post } from './post/post.entity';
import { User } from './user/user.entity';
import { Comment } from './comment/comment.entity';
import { join } from 'path';
import { DateScalar } from './date.scalar';
import { upperDirectiveTransformer } from './upper.directives';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      csrfPrevention: false,
      context: ({ req }) => ({ req }),
      transformSchema: (schema) => upperDirectiveTransformer(schema),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'GraphQL',
      entities: [User, Post, Comment],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    PostModule,
    CommentModule,
  ],
  providers: [DateScalar],
})
export class AppModule {}
