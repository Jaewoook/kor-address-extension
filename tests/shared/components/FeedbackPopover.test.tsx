import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FeedbackPopover } from "@shared/components/FeedbackPopover";

vi.mock("axios");
const mockedPost = vi.mocked(axios.post);

const openForm = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.hover(screen.getByText("피드백 보내기"));
  return {
    textarea: await screen.findByRole("textbox"),
    sendButton: screen.getByRole("button", { name: "보내기 🎉" }),
  };
};

describe("FeedbackPopover", () => {
  beforeEach(() => {
    mockedPost.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("can't be sent while the message is empty", async () => {
    const user = userEvent.setup();
    render(<FeedbackPopover />);

    const { sendButton } = await openForm(user);

    expect(sendButton).toBeDisabled();
  });

  it("sends the feedback and confirms it was delivered", async () => {
    mockedPost.mockResolvedValueOnce({});
    const user = userEvent.setup();
    render(<FeedbackPopover />);

    const { textarea, sendButton } = await openForm(user);
    await user.type(textarea, "좋아요");
    await user.click(sendButton);

    expect(mockedPost).toHaveBeenCalledWith(
      "https://api.jaewook.me/email/addr-extension-feedback",
      { feedbackContent: "좋아요" },
    );
    expect(await screen.findByRole("button", { name: "피드백 전달 완료! 💛" })).toBeDisabled();
    expect(textarea).toBeDisabled();
  });

  it("lets the user retry when sending fails", async () => {
    mockedPost.mockRejectedValueOnce(new Error("network error"));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<FeedbackPopover />);

    const { textarea, sendButton } = await openForm(user);
    await user.type(textarea, "좋아요");
    await user.click(sendButton);

    await waitFor(() => expect(sendButton).toBeEnabled());
    expect(sendButton).toHaveTextContent("보내기 🎉");
    expect(textarea).toBeEnabled();
    expect(consoleError).toHaveBeenCalled();
  });
});
