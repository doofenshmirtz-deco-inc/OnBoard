import {ArgsType, Field, Int} from "type-graphql";
import {IsIn} from "class-validator";

@ArgsType()
export class PaginationArgs {
	@Field(() => Int, { defaultValue: 10 })
	limit?: number;
	
	@Field(() => Int, { defaultValue: 0 })
	skip?: number;

	// TODO validate
	@Field({ nullable: true })
	orderBy: string;

	@Field(() => String, { nullable: true })
	@IsIn(['ASC', 'DESC'])
	order: 'ASC' | 'DESC';
}

export function getOrder (pag: PaginationArgs) {
	let order = {};
	if (pag.order && pag.orderBy) order = { id: pag.order }

	return order;
}
