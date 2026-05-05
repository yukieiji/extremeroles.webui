import type { StateCreator } from "zustand";
import type { RoleAssignFilterSetUI } from "../type";

/**
 * Role Filter の状態を管理するスライスのインターフェース
 */
export interface RoleFilterSlice {
	roleFilterSet: Record<string, RoleAssignFilterSetUI>;
	setRoleFilterSet: (data: Record<string, RoleAssignFilterSetUI>) => void;
	addRoleFilter: (guid: string) => void;
	deleteRoleFilter: (guid: string) => void;
	addRoleToFilter: (guid: string, roleId: number, roleName: string) => void;
	removeRoleFromFilter: (guid: string, roleId: number) => void;
	incrementAssignNum: (guid: string) => void;
	decrementAssignNum: (guid: string) => void;
	isUpdatingAssignNum: Record<string, boolean>;
	setIsUpdatingAssignNum: (guid: string, isUpdating: boolean) => void;
}

/**
 * Role Filter の状態管理を行うスライスの生成
 */
export const createRoleFilterSlice: StateCreator<RoleFilterSlice> = (set) => {
	return {
		roleFilterSet: {},
		isUpdatingAssignNum: {},
		setRoleFilterSet: (data: Record<string, RoleAssignFilterSetUI>) => {
			set({ roleFilterSet: data });
		},
		addRoleFilter: (guid: string) => {
			set((state) => {
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							AssignNum: 1,
							Roles: [],
						},
					},
				};
			});
		},
		deleteRoleFilter: (guid: string) => {
			set((state) => {
				const nextRoleFilterSet = { ...state.roleFilterSet };
				delete nextRoleFilterSet[guid];
				return {
					roleFilterSet: nextRoleFilterSet,
				};
			});
		},
		addRoleToFilter: (guid: string, roleId: number, roleName: string) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter) {
					return state;
				}
				if (filter.Roles.some((r) => r.id === roleId)) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							Roles: [...filter.Roles, { id: roleId, name: roleName }],
						},
					},
				};
			});
		},
		removeRoleFromFilter: (guid: string, roleId: number) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							Roles: filter.Roles.filter((r) => r.id !== roleId),
						},
					},
				};
			});
		},
		incrementAssignNum: (guid: string) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter || filter.AssignNum >= 255) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							AssignNum: filter.AssignNum + 1,
						},
					},
				};
			});
		},
		decrementAssignNum: (guid: string) => {
			set((state) => {
				const filter = state.roleFilterSet[guid];
				if (!filter || filter.AssignNum <= 1) {
					return state;
				}
				return {
					roleFilterSet: {
						...state.roleFilterSet,
						[guid]: {
							...filter,
							AssignNum: filter.AssignNum - 1,
						},
					},
				};
			});
		},
		setIsUpdatingAssignNum: (guid: string, isUpdating: boolean) => {
			set((state) => {
				return {
					isUpdatingAssignNum: {
						...state.isUpdatingAssignNum,
						[guid]: isUpdating,
					},
				};
			});
		},
	};
};
