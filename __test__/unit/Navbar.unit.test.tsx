import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import Navbar from '@/components/Navbar'

import { useSession } from 'next-auth/react'
import { usePathname } from "next/navigation";

import {IUser} from "@/models/user";

jest.mock("next-auth/react");
jest.mock("next/navigation");


// Mocks useSession, use no arguments for unathorized
const mockUseSession = (
  userObject: IUser | null = null, // user details
  status: string | null = null // auth status
) => {
  (useSession as jest.Mock).mockReturnValue({
    data: userObject ? {user: userObject} : null,
    status: status || "unauthenticated",
  })
}

// Some components rely on the pathname hook to set classes of active elements (route = window.location)
const mockPathname = (route: string = "/") => (usePathname as jest.Mock).mockReturnValue(route);


const mockUser: IUser = {
  username: "nice",
  email: "nice",
  image: "https://hello.com/web.png",
  id: "323113232123",
  name: "Bob Lee",
}


describe('Navbar', () => {

  it('renders the navbar', () => {

    mockUseSession();
    render(<Navbar />);
    
    // Set screen size
    global.innerWidth = 1500;
    global.outerWidth = 1600;

    const logo = screen.getByRole("img", {name: "logo"})
 
    expect(logo).toBeInTheDocument()
  })

  it("Default profile image is present when not authenticated", () => {
    mockUseSession();
    render(<Navbar/>);

    // test id will reflect auth or non authed status
    const profileImg = screen.getByTestId("full-screen-profileImg-nonAuth")
    expect(profileImg).toBeInTheDocument();    
  })

  it("Profile image is available when authenticated", () => {
    mockUseSession(mockUser, "authenticated");
    render(<Navbar/>);

    const profileImg = screen.getByTestId("full-screen-profileImg-auth");
    expect(profileImg).toBeInTheDocument();    
  })

  it("Link style is set to active when window location equals link name", () => {

    mockUseSession();
    mockPathname();

    render(<Navbar/>);

    const homeLink = screen.getByRole("link", {name: "Home"});
    expect(homeLink).toHaveClass("nav_link_active");
  })

  it("Making sure the dropdown works when user is authenticated", async () => {
    mockUseSession(mockUser, "authenticated");
    mockPathname();
      
    render(<Navbar/>);

    const profileImage = screen.getByTestId("full-screen-profileImg-auth");
    expect(profileImage).toBeInTheDocument();


    await waitFor(() => {
      fireEvent.click(profileImage);

      const dropdown = screen.getByTestId("full-screen-dropdown");
      expect(dropdown).toBeInTheDocument();
    })

  })
})


/* FOR MOBILE NAVBAR LAYOUT, DO NOT DELETE */

describe("Mobile Navbar", () => {
  // Setting the screen min width
  beforeAll(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 639,
    })
  })

  const openMobileMenu = () => {
    const hamburger = screen.getByTestId("hamburger");
    expect(hamburger).toBeInTheDocument();

    fireEvent.click(hamburger);

    return hamburger;
  }

  it("Hamburger icon renders when screen < 639px width", () => {
    mockUseSession();
    mockPathname();

    render(<Navbar/>);

    const hamburger = screen.getByTestId("hamburger");
    expect(hamburger).toBeInTheDocument();
  })

  it("Toggle between Hamburger button and Close button, ensure navigation menu appears on Hamburger click and closes on Close button press", async () => {
    mockUseSession();
    mockPathname();

    render(<Navbar/>);

    const hamburger = openMobileMenu();
    // const hamburger = screen.getByTestId("hamburger");
    // expect(hamburger).toBeInTheDocument();

    // fireEvent.click(hamburger);

    let mobileMenu, close;

    await waitFor(() => {
      mobileMenu = screen.getByTestId("mobile-nav-menu");
      expect(mobileMenu).toBeInTheDocument();

      close = screen.getByTestId("close");
      expect(close).toBeInTheDocument();

      fireEvent.click(close);
      expect(screen.queryByTestId("mobile-nav-menu")).toBeNull();

      expect(hamburger).toBeInTheDocument();
    })
  })

  it("Ensures the mobile nav links have the proper classes", async () => {
    mockUseSession();
    mockPathname();

    render(<Navbar/>);

    openMobileMenu();

    
    waitFor(() => {
      const homeLink = screen.getByRole("link", {name: "Home"});
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveClass(".navM_link_active");

      const aboutLink = screen.getByRole("link", {name: "About"});
      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveClass(".navM_link_item");
    })
  })

  it("Ensure that when authenticated the profile information is displayed in mobile nav menu", async () => {
    mockUseSession(mockUser, "authenticated");
    mockPathname();

    render(<Navbar/>);

    openMobileMenu();

    const image = screen.getByTestId("mobile-screen-profileImg-auth");
    expect(image).toBeInTheDocument();

    const profileInfo = screen.getByTestId("mobile-screen-profileInfo");
    expect(profileInfo).toBeInTheDocument();

    await waitFor(() => {
      const username = within(profileInfo).getByTestId("profileInfo-name");
      expect(username).toBeInTheDocument();
      expect(username.textContent).toEqual(mockUser.name);
  
      const email = within(profileInfo).getByTestId("profileInfo-email");
      expect(email).toBeInTheDocument();
      expect(email.textContent).toEqual(mockUser.email);
    });
  })

})