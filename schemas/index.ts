import { createSchema, list } from '@keystone-next/keystone/schema';
import User from "./User";
import Post from "./Post";
import Tag from "./Tag";

export const lists = createSchema({
    User,
    Post,
    Tag
});
