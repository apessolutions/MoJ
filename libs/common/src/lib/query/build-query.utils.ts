import { FindManyOptions } from 'typeorm';

import { ExtendedFindConfig, FindConfig } from '../types/query.type';
/**
 * Used to build TypeORM queries.
 * @param selector The selector
 * @param config The config
 * @return The QueryBuilderConfig
 */
export function buildQuery<TWhereKeys extends object, TEntity = unknown>(
  selector: TWhereKeys,
  config: FindConfig<TEntity> = {}
) {
  const query: ExtendedFindConfig<TEntity> = {
    where: selector,
  };

  if ('deleted_at' in selector || config.withDeleted) {
    query.withDeleted = true;
  }

  if ('skip' in config) {
    (query as FindManyOptions<TEntity>).skip = config.skip ?? undefined;
  }

  if ('take' in config) {
    (query as FindManyOptions<TEntity>).take = config.take ?? undefined;
  }

  if (config.relations) {
    query.relations = config.relations;
  }

  if (config.order) {
    query.order = config.order;
  }

  return query;
}

/**
 * @param constraints
 *
 * @example
 * const q = buildWhere(
 *   {
 *     id: "1234",
 *     test1: ["123", "12", "1"],
 *     test2: Not("this"),
 *     date: { gt: date },
 *     amount: { gt: 10 },
 *   },
 *)
 *
 * // Output
 * {
 *    id: "1234",
 *    test1: In(["123", "12", "1"]),
 *    test2: Not("this"),
 *    date: MoreThan(date),
 *    amount: MoreThan(10)
 * }
 */
// function buildWhere<TWhereKeys extends object, TEntity>(
//   constraints: TWhereKeys,
// ): FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] {
//   if (!constraints) return {};
//   let where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[] = {};

//   if (Array.isArray(constraints)) {
//     where = [];
//     constraints.forEach((constraint) => {
//       (where as FindOptionsWhere<TEntity>[]).push(
//         buildWhere(constraint) as FindOptionsWhere<TEntity>,
//       );
//     });

//     return where;
//   }

//   for (const [key, value] of Object.entries(constraints)) {
//     if (value === undefined) {
//       continue;
//     }

//     if (value === null) {
//       where[key] = IsNull();
//       continue;
//     }

//     if (value instanceof FindOperator) {
//       where[key] = value;
//       continue;
//     }

//     if (Array.isArray(value)) {
//       where[key] = In(value);
//       continue;
//     }

//     if (typeof value === 'object') {
//       Object.entries(value).forEach(([objectKey, objectValue]) => {
//         where[key] = where[key] || [];
//         if (operatorsMap[objectKey]) {
//           where[key].push(operatorsMap[objectKey](objectValue));
//         } else {
//           if (objectValue != undefined && typeof objectValue === 'object') {
//             where[key] = buildWhere<any, TEntity>(objectValue);
//             return;
//           }
//           where[key] = value;
//         }
//         return;
//       });

//       if (!Array.isArray(where[key])) {
//         continue;
//       }

//       if (where[key].length === 1) {
//         where[key] = where[key][0];
//       } else {
//         where[key] = And(...where[key]);
//       }

//       continue;
//     }

//     where[key] = value;
//   }

//   return where;
// }

type Order = {
  [key: string]: 'ASC' | 'DESC' | Order;
};

/**
 * Convert an order of dot string into a nested object
 * @example
 * input: { id: "ASC", "items.title": "ASC", "items.variant.title": "ASC" }
 * output: {
 *   "id": "ASC",
 *   "items": {
 *     "id": "ASC",
 *     "variant": {
 *        "title": "ASC"
 *     }
 *   },
 * }
 * @param orderBy
 */
export function buildOrder(orderBy: { [k: string]: 'ASC' | 'DESC' }): Order {
  const output: Order = {};

  const orderKeys = Object.keys(orderBy);

  for (const order of orderKeys) {
    if (order.indexOf('.') > -1) {
      const nestedOrder = order.split('.');

      let parent = output;

      while (nestedOrder.length > 1) {
        const nestedRelation = nestedOrder.shift() as string;
        parent = (parent[nestedRelation] as Order) ??= {};
      }

      parent[nestedOrder[0]] = orderBy[order];

      continue;
    }

    output[order] = orderBy[order];
  }

  return output;
}
