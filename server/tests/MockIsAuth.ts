import {ResolverData, NextFn, MiddlewareFn} from "type-graphql";
import {Context} from "../src/middleware/Context";

export const isAuthMock = async (data: ResolverData<Context>, next: NextFn, uid: string) => {
	data.context.payload = { uid };

	return next();
}
