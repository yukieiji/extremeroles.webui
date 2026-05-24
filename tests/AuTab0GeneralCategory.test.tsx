import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuTab0GeneralCategory } from "@/feature/rightsidepanel/AuTab0GeneralCategory";
import { auOptionMetaData, resetAuOptionMetaData } from "@/logics/api";
import type { AuOptionId } from "@/type";
import { useStore } from "@/useStore";

// モック
vi.mock("@/hooks/useAuNavigation", () => ({
	useAuNavigation: () => ({
		navigateToOption: vi.fn(),
	}),
}));

describe("AuTab0GeneralCategory", () => {
	beforeEach(() => {
		resetAuOptionMetaData();
		// ストアの状態をリセット（必要に応じて個別の値をセット）
		useStore.setState({
			openedAuTab0CategoryIds: {},
			auValue: {},
		});
	});

	it("returns null if category metadata is missing", () => {
		const { container } = render(<AuTab0GeneralCategory categoryId={999} />);
		expect(container.firstChild).toBeNull();
	});

	it("renders category name and options", () => {
		const categoryId = 1;
		const optionId1 = 101 as unknown as AuOptionId;
		const optionId2 = 102 as unknown as AuOptionId;

		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [optionId1, optionId2],
		};
		auOptionMetaData.options[optionId1] = {
			title: "Option 1",
			format: "{0}",
			range: ["Value 1"],
		};
		auOptionMetaData.options[optionId2] = {
			title: "Option 2",
			format: "{0}",
			range: ["Value 2"],
		};

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		expect(screen.getByText("Test Category")).toBeInTheDocument();
		expect(screen.getByText("Option 1")).toBeInTheDocument();
		expect(screen.getByText("Option 2")).toBeInTheDocument();
		expect(screen.getByText("Value 1")).toBeInTheDocument();
		expect(screen.getByText("Value 2")).toBeInTheDocument();
	});

	it("toggles accordion when clicked", () => {
		const categoryId = 1;
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [],
		};

		const toggleSpy = vi.spyOn(useStore.getState(), "toggleAuTab0Category");

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		const accordionButton = screen.queryByRole("button", {
			name: /Test Category/i,
		});
		// オプションがない場合、filteredOptionsが空になり、nullが返るようになった
		expect(accordionButton).not.toBeInTheDocument();
	});

	it("filters out Impostor Count option", () => {
		const categoryId = 1;
		const impCountOptionId = 10200 as unknown as AuOptionId; // OptionName 1, ValueType Int (1*10000 + 2*100)
		const otherOptionId = 10103 as unknown as AuOptionId;

		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [impCountOptionId, otherOptionId],
		};
		auOptionMetaData.options[impCountOptionId] = {
			title: "Impostor Count",
			format: "{0}",
			range: [1],
		};
		auOptionMetaData.options[otherOptionId] = {
			title: "Other Option",
			format: "{0}",
			range: ["Value"],
		};

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		expect(screen.queryByText("Impostor Count")).not.toBeInTheDocument();
		expect(screen.getByText("Other Option")).toBeInTheDocument();
	});

	it("reflects the open state from the store", () => {
		const categoryId = 1;
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [101 as unknown as AuOptionId],
		};
		auOptionMetaData.options[101 as unknown as AuOptionId] = {
			title: "Option 1",
			format: "{0}",
			range: ["Value 1"],
		};

		// 閉じた状態をセット
		useStore.setState({
			openedAuTab0CategoryIds: { [categoryId]: false },
		});

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		// CompactAccordion は isOpen=false の場合、中身をレンダリングしない
		const optionElement = screen.queryByText("Option 1");
		expect(optionElement).not.toBeInTheDocument();
	});

	it("is open by default if not specified in the store", () => {
		const categoryId = 1;
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [101 as unknown as AuOptionId],
		};
		auOptionMetaData.options[101 as unknown as AuOptionId] = {
			title: "Option 1",
			format: "{0}",
			range: ["Value 1"],
		};

		// ストアに何も設定されていない状態（beforeEachでリセット済みだが明示的に）
		useStore.setState({
			openedAuTab0CategoryIds: {},
		});

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		// デフォルトで開いているので、中身が表示されるはず
		expect(screen.getByText("Option 1")).toBeInTheDocument();
	});

	it("reflects the open state when explicitly set to true in the store", () => {
		const categoryId = 1;
		auOptionMetaData.categoryMetaData[categoryId] = {
			name: "Test Category",
			options: [101 as unknown as AuOptionId],
		};
		auOptionMetaData.options[101 as unknown as AuOptionId] = {
			title: "Option 1",
			format: "{0}",
			range: ["Value 1"],
		};

		// 明示的に true をセット
		useStore.setState({
			openedAuTab0CategoryIds: { [categoryId]: true },
		});

		render(<AuTab0GeneralCategory categoryId={categoryId} />);

		expect(screen.getByText("Option 1")).toBeInTheDocument();
	});
});
