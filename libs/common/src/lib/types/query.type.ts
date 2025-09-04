import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export interface FindConfig<Entity> {
  select?: (keyof Entity)[];
  withDeleted?: boolean;
  skip?: number;
  take?: number;
  relations?: FindOptionsRelations<Entity>;
  order?: FindOptionsOrder<Entity>;
}

export type ExtendedFindConfig<TEntity> = (
  | Omit<FindOneOptions<TEntity>, 'where' | 'relations' | 'select'>
  | Omit<FindManyOptions<TEntity>, 'where' | 'relations' | 'select'>
) & {
  select?: FindOptionsSelect<TEntity>;
  relations?: FindOptionsRelations<TEntity>;
  where: FindOptionsWhere<TEntity> | FindOptionsWhere<TEntity>[];
  order?: FindOptionsOrder<TEntity>;
  skip?: number;
  take?: number;
};

export type IFindOptions<TEntity> =
  | FindOptionsWhere<TEntity>
  | FindOptionsWhere<TEntity>[];
