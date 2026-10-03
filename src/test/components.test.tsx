import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "../components/Navbar";
import { Faq } from "../components/Faq";
import { LeadForm } from "../components/LeadForm";
import App from "../App";
import { navItems, properties } from "../data";
import { contacts, price } from "../config/site";

describe("Navbar", () => {
  it("keeps nav links hidden on mobile until the menu is opened", async () => {
    const user = userEvent.setup();
    render(<Navbar onNavigate={vi.fn()} />);

    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    const menu = await screen.findByRole("button", { name: /close menu/i });
    expect(menu).toHaveAttribute("aria-expanded", "true");
    // Every nav destination is reachable on a phone.
    expect(screen.getAllByRole("button", { name: "Location" }).length).toBeGreaterThan(0);
  });

  it("calls onNavigate with the section id and closes the menu", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Navbar onNavigate={onNavigate} />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const [contactButton] = screen.getAllByRole("button", { name: "Contact" });
    await user.click(contactButton);

    expect(onNavigate).toHaveBeenCalledWith("contact");
  });

  it("closes the mobile menu on Escape", async () => {
    const user = userEvent.setup();
    render(<Navbar onNavigate={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument(),
    );
  });

  it("links the WhatsApp button to the primary number", () => {
    render(<Navbar onNavigate={vi.fn()} />);
    expect(
      screen.getByRole("link", { name: /whatsapp us/i }).getAttribute("href"),
    ).toBe(`https://wa.me/${contacts.whatsapp}`);
  });
});

describe("Faq", () => {
  it("renders questions with expand buttons", () => {
    render(<Faq />);
    expect(screen.getAllByRole("button")).not.toHaveLength(0);
    const first = screen.getAllByRole("button")[0];
    expect(first).toHaveAttribute("aria-expanded");
  });

  it("reveals the answer when a question is clicked", async () => {
    const user = userEvent.setup();
    render(<Faq />);

    const questions = screen.getAllByRole("button");
    const closed = questions.find((q) => q.getAttribute("aria-expanded") === "false");
    expect(closed).toBeDefined();

    await user.click(closed!);
    expect(closed).toHaveAttribute("aria-expanded", "true");
  });
});

describe("LeadForm", () => {
  it("blocks submission and shows errors when required fields are empty", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid 10-digit mobile/i)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();

    openSpy.mockRestore();
  });

  it("rejects a malformed phone number", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh");
    await user.type(screen.getByLabelText(/mobile number/i), "12345");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    expect(screen.getByText(/valid 10-digit mobile/i)).toBeInTheDocument();
    expect(openSpy).not.toHaveBeenCalled();

    openSpy.mockRestore();
  });

  it("opens WhatsApp with the details prefilled on a valid submission", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh Kumar");
    await user.type(screen.getByLabelText(/mobile number/i), "9505903371");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0] as [string];
    // Lead forms deep-link to the number, so the URL carries it as well as the
    // prefilled message - that is what makes the reply land in the right chat.
    expect(url).toContain(`https://wa.me/${contacts.whatsapp}?text=`);
    expect(decodeURIComponent(url)).toContain("Ramesh Kumar");
    expect(decodeURIComponent(url)).toContain("9505903371");

    openSpy.mockRestore();
  });

  it("confirms to the visitor after a successful submission", async () => {
    const user = userEvent.setup();
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh");
    await user.type(screen.getByLabelText(/mobile number/i), "9505903371");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    expect(await screen.findByText(/details captured/i)).toBeInTheDocument();

    openSpy.mockRestore();
  });

  /**
   * The lead-loss path this replaces.
   *
   * iOS Safari and several popup blockers suppress `window.open`. The old code
   * showed "Request received" and let the visitor believe we had their
   * details, while the message went nowhere. The success state must therefore
   * always render a real anchor that completes the handover.
   */
  it("offers a real WhatsApp link when the popup is blocked", async () => {
    const user = userEvent.setup();
    // A blocked popup returns null, which is exactly what iOS Safari does.
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh Kumar");
    await user.type(screen.getByLabelText(/mobile number/i), "9505903371");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    const fallback = await screen.findByRole("link", {
      name: /send my details on whatsapp/i,
    });
    const href = fallback.getAttribute("href") ?? "";

    expect(href).toContain(`https://wa.me/${contacts.whatsapp}?text=`);
    expect(decodeURIComponent(href)).toContain("Ramesh Kumar");
    expect(decodeURIComponent(href)).toContain("9505903371");

    openSpy.mockRestore();
  });

  it("offers the phone number as a second fallback", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh");
    await user.type(screen.getByLabelText(/mobile number/i), "9505903371");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    await screen.findByRole("link", { name: /send my details on whatsapp/i });

    // Both numbers are reachable, so a blocked WhatsApp is never terminal.
    const telLinks = screen
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"))
      .filter((h) => h?.startsWith("tel:+")) as string[];

    expect(telLinks).toContain(`tel:+${contacts.whatsapp}`);
    expect(telLinks).toContain(`tel:+${contacts.inquiry}`);
  });

  it("returns to an empty form after sending another enquiry", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "open").mockImplementation(() => null);
    render(<LeadForm />);

    await user.type(screen.getByLabelText(/your name/i), "Ramesh");
    await user.type(screen.getByLabelText(/mobile number/i), "9505903371");
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    await user.click(
      await screen.findByRole("button", { name: /send another enquiry/i }),
    );

    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
    expect(screen.getByLabelText(/mobile number/i)).toHaveValue("");
  });

  it("marks invalid fields with aria-invalid for screen readers", async () => {
    const user = userEvent.setup();
    render(<LeadForm />);

    const phone = screen.getByLabelText(/mobile number/i);
    await user.click(screen.getByRole("button", { name: /send enquiry/i }));

    expect(phone).toHaveAttribute("aria-invalid", "true");
  });
});

describe("property pricing", () => {
  it("keeps every advertised price at the advertised starting price", () => {
    // The posters, SEO tags and cards must never quote different numbers.
    for (const property of properties) {
      expect(property.priceLabel).toBe(price.display);
      expect(property.price).toBe(price.numeric);
    }
  });

  it("does not advertise a discount against the real price", () => {
    // A "Was 24L" badge would be false advertising now that 24 lakhs is the
    // price being asked, and it is the kind of claim that draws complaints.
    for (const property of properties) {
      expect(property.badge ?? "").not.toMatch(/was\s*₹?\s*24/i);
    }
  });
});

describe("page structure", () => {
  it("renders a section for every navbar destination", () => {
    // This is the check that catches a nav link scrolling nowhere: if a
    // section loses its id, this fails the same deploy.
    render(<App />);
    for (const item of navItems) {
      expect(document.getElementById(item.id)).not.toBeNull();
    }
  });

  it("shows the price and the primary phone number to visitors", () => {
    render(<App />);
    expect(screen.getAllByText(new RegExp(price.display.replace(/[₹,]/g, "\\$&"))).length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /95059 03371/i }).length,
    ).toBeGreaterThan(0);
  });

  it("offers a WhatsApp route to the correct number from every section", () => {
    const { container } = render(<App />);
    const whatsappLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]'),
    );

    expect(whatsappLinks.length).toBeGreaterThan(3);
    for (const link of whatsappLinks) {
      // Either the share form (wa.me/?text=) or the deep link (wa.me/<number>).
      const href = link.getAttribute("href") ?? "";
      expect(href).toMatch(
        /^https:\/\/wa\.me\/(919505903371|\?text=)/,
      );
    }
  });

  it("never renders an empty href, which silently breaks on mobile", () => {
    const { container } = render(<App />);
    for (const anchor of container.querySelectorAll("a")) {
      const href = anchor.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
    }
  });

  it("uses locally hosted QR codes rather than a third-party QR API", () => {
    const { container } = render(<App />);
    const qrImages = Array.from(
      container.querySelectorAll<HTMLImageElement>('img[src*="qr"]'),
    );

    expect(qrImages.length).toBeGreaterThan(0);
    for (const img of qrImages) {
      expect(img.getAttribute("src")).toMatch(/^\/qr\/[a-z]+\.png$/);
      expect(img.getAttribute("alt")).toBeTruthy();
    }
  });
});