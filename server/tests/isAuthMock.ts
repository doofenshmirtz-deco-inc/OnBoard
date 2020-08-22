import {ResolverData, NextFn, MiddlewareFn} from "type-graphql";
import {Context} from "../src/middleware/Context";


// For some reason data is undefined. I've given up for the moment
export const isAuthMock = async (data: ResolverData<Context>, next: NextFn, uid: string) => {
	console.log(data);
	data.context.payload = { uid };

	return next();
}
