import { generator } from '../variables/generator';

const breakpoints = ['xs', 'sm', 'md', 'lg', 'phone', 'tablet', 'tabletLandscape', 'desktop'] as const;
const spaceNames = ['mb', 'ml', 'mr', 'mt', 'pb', 'pl', 'pr', 'pt'] as const;

/**
 * Helper Types
 */
export type BoolProps<T extends Object> = Partial<Record<keyof T, boolean>>;
type MqProp<T> = Partial<Record<typeof breakpoints[number], T>> | T;

/**
 * GeneratedPropsTypes
 */

type IndexKeys<T> = Exclude<keyof T, keyof []>;
type ListProp = { name: string; list?: object };
type ListObject = { list: object };
type GetName<P> = P extends ListProp ? P['name'] : never;
type GetListKeys<P> = P extends ListProp ? keyof P['list'] : never;
type GetNames<P> = P extends ListObject ? keyof P['list'] : never;

type PropsFromList<PropList extends ReadonlyArray<ListProp>> = {
    [i in IndexKeys<PropList> as GetName<PropList[i]>]?: MqProp<GetListKeys<PropList[i]>> | MqProp<number>;
};

type NamedPropsFromList<PropList extends ReadonlyArray<ListObject>> = {
    [i in IndexKeys<PropList> as GetNames<PropList[i]>]?: boolean;
};

type NamedProps = NamedPropsFromList<typeof generator.namedProps>;
type SpaceProps = Partial<Record<typeof spaceNames[number], MqProp<number | string>>>;
type VariableProps = PropsFromList<typeof generator.variableProps>;

export type GeneratedPropsTypes = NamedProps & SpaceProps & VariableProps;
