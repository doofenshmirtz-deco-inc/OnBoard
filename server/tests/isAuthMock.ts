import {ResolverData, NextFn, MiddlewareFn} from "type-graphql";
import {Context, Payload} from "../src/middleware/Context";

export interface TestingData {
	context: {
		payload?: Payload
	}
}

export const isAuthMock = async (data: TestingData, next: NextFn, uid: string) => {
	console.log(data);
	data.context.payload = { uid };

	return next();
}
