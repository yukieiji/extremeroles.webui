import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SearchSearchBar } from "@/feature/SearchSearchBar";
import { useSearchNavigation } from "@/hooks/useOptionNavigation";
import { useStore } from "@/useStore";
import { globalSearchItems } from "@/logics/api";

vi.mock("@/useStore", () => ({
	useStore: vi.fn(),
}));

vi.mock("@/hooks/useOptionNavigation", () => ({
	useSearchNavigation: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock("@/logics/api", () => ({
	globalSearchItems: [],
}));

describe("SearchSearchBar", () => {
	const setOptionSearchQuery = vi.fn();
	const setIsOptionSearchFocused = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		globalSearchItems.length = 0;
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				optionSearchQuery: "",
				setOptionSearchQuery,
				isOptionSearchFocused: false,
				setIsOptionSearchFocused,
				isExROptionActive: {},
			};
			return selector(state);
		});
	});

	it("should render input correctly", () => {
		render(<SearchSearchBar />);
		expect(screen.getByPlaceholderText("オプションを検索...")).toBeInTheDocument();
	});

	it("should call setOptionSearchQuery on change", () => {
		render(<SearchSearchBar />);
		const input = screen.getByPlaceholderText("オプションを検索...");
		fireEvent.change(input, { target: { value: "test" } });
		expect(setOptionSearchQuery).toHaveBeenCalledWith("test");
	});

	it("should show results when focused and query exists", () => {
		globalSearchItems.push({
			id: "1",
			tearm: "Target Option",
			info: { mode: "au-opt" } as any,
		});

		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				optionSearchQuery: "target",
				setOptionSearchQuery,
				isOptionSearchFocused: true,
				setIsOptionSearchFocused,
				isExROptionActive: {},
			};
			return selector(state);
		});

		render(<SearchSearchBar />);
		expect(screen.getByText("Target Option")).toBeInTheDocument();
	});

    it("should show 'no results' if no match", () => {
		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				optionSearchQuery: "nomatch",
				isOptionSearchFocused: true,
				setIsOptionSearchFocused,
                setOptionSearchQuery,
                isExROptionActive: {},
			};
			return selector(state);
		});

		render(<SearchSearchBar />);
		expect(screen.getByText("結果が見つかりませんでした")).toBeInTheDocument();
	});

    it("should gray out inactive ExR options", () => {
		globalSearchItems.push({
			id: "exr-1",
			tearm: "Inactive ExR",
			info: { mode: "exr-opt", uniqueOptionId: 100 } as any,
		});

		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				optionSearchQuery: "inactive",
				isOptionSearchFocused: true,
				setIsOptionSearchFocused,
				setOptionSearchQuery,
				isExROptionActive: { 100: false },
			};
			return selector(state);
		});

		render(<SearchSearchBar />);
		const button = screen.getByRole("button", { name: /Inactive ExR/ });
		expect(button).toHaveClass("opacity-50");
	});

	it("should call navigate and clear query when result is clicked", () => {
		const navigate = vi.fn();
		vi.mocked(useSearchNavigation).mockReturnValue(navigate);

		globalSearchItems.push({
			id: "1",
			tearm: "Target Option",
			info: { mode: "au-opt" } as any,
		});

		vi.mocked(useStore).mockImplementation((selector: any) => {
			const state = {
				optionSearchQuery: "target",
				setOptionSearchQuery,
				isOptionSearchFocused: true,
				setIsOptionSearchFocused,
				isExROptionActive: {},
			};
			return selector(state);
		});

		render(<SearchSearchBar />);
		const button = screen.getByText("Target Option");
		fireEvent.click(button);

		expect(navigate).toHaveBeenCalled();
		expect(setOptionSearchQuery).toHaveBeenCalledWith("");
		expect(setIsOptionSearchFocused).toHaveBeenCalledWith(false);
	});

	it("should handle blur with timeout", () => {
		vi.useFakeTimers();
		render(<SearchSearchBar />);
		const input = screen.getByPlaceholderText("オプションを検索...");
		fireEvent.blur(input);

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(setIsOptionSearchFocused).toHaveBeenCalledWith(false);
		vi.useRealTimers();
	});

	it("should handle focus", () => {
		render(<SearchSearchBar />);
		const input = screen.getByPlaceholderText("オプションを検索...");
		fireEvent.focus(input);
		expect(setIsOptionSearchFocused).toHaveBeenCalledWith(true);
	});
});
