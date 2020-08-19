import { Resolver, Query, Args, Arg, ID, Int, UseMiddleware } from "type-graphql";
import {User} from "../models/User";
import {PaginationArgs, getOrder} from "./Types";
import {isAuth} from "../middleware/isAuth";

@Resolver()
export class UserResolver {
	@Query(() => [User])
	@UseMiddleware(isAuth)
	async users(@Args() pag: PaginationArgs) {

		return (await User.findAndCount({
			order: getOrder(pag),
			take: pag.limit,
			skip: pag.skip
		}))[0];
	}

	@Query(() => User, { nullable: true })
	async user(@Arg('id', () => Int) id: typeof Int): Promise<User | undefined>  {
		console.log( await User.findOne({
			where: { id }
		})
		);

		return User.findOne({
			where: { id }
		});
	}
}


