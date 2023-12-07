import { render, screen } from '@testing-library/react'
import Home from '../src/pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders the component', () => {
    render(<Home />);
    expect(screen.getByText(/create t3 app/i)).toBeInTheDocument();
  });


  it("renders links with correct href attributes", () => {
    render(<Home />);
    const firstStepsLink = screen.getByText(/first steps →/i);
    const documentationLink = screen.getByText(/documentation →/i);

    expect(firstStepsLink).toHaveAttribute(
      "href",
      "https://create.t3.gg/en/usage/first-steps"
    );
    expect(documentationLink).toHaveAttribute(
      "href",
      "https://create.t3.gg/en/introduction"
    );
  });

  it("displays greeting text when data is available", () => {
    const mockGreeting = "Hello, Jest!";
    // Mock the useQuery response
    jest
      .spyOn(require("../path-to-your-api").post.hello, "useQuery")
      .mockReturnValueOnce({
        data: { greeting: mockGreeting },
        isLoading: false,
        isError: false,
      });

    render(<Home />);
    const greetingText = screen.getByText(mockGreeting);
    expect(greetingText).toBeInTheDocument();
  });

  it("displays loading text while data is being fetched", () => {
    // Mock the useQuery response when still loading
    jest
      .spyOn(require("../path-to-your-api").post.hello, "useQuery")
      .mockReturnValueOnce({
        isLoading: true,
      });

    render(<Home />);
    const loadingText = screen.getByText(/loading tRPC query/i);
    expect(loadingText).toBeInTheDocument();
  });

  it("displays fallback text when there is an error fetching data", () => {
    // Mock the useQuery response when there is an error
    jest
      .spyOn(require("../path-to-your-api").post.hello, "useQuery")
      .mockReturnValueOnce({
        isError: true,
      });

    render(<Home />);
    const fallbackText = screen.getByText(/loading tRPC query/i);
    expect(fallbackText).toBeInTheDocument();
  });
})
