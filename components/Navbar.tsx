'use client'
import Image from "next/image";
import Logo from "@/public/images/bubbles_normal.svg";
import Avatar from "@/public/images/avatar-d.png";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {signIn, signOut, useSession, getProviders} from "next-auth/react";

// import styles from "@/components/Navbar.module.css";
import styles from "@/public/assets/styles/Navbar.module.css";


const Navbar = () => {
  const {data: session, status} = useSession();
  const pathname = usePathname();

  const [providers, setProviders] = useState<null | Record<any, any>>(null);
  const [mobileNavMenu, setMobileNavMenu] = useState<boolean>(false);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Sets up the Auth Providers
    const setUpProviders = async () => {
      const response = await getProviders();
      if (response) {
        setProviders(response);
      }
    }

    // Call to setup providers
    setUpProviders();

    /* 
      This closes the dropdown whenever its open and the user clicks on anything but the dropdown and the profile image,
      there has to be a cleaner solution but I did not want to pass props from the parent component.      
    */
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      const target = event.target as Node
      toggleDropdown && !dropdownRef?.current?.contains(target) && !profileRef?.current?.contains(target) && setToggleDropdown(false);
    }

    // Add event listener to window to watch for clicks
    window.addEventListener("click", handleClickOutsideDropdown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("click", handleClickOutsideDropdown);
    }

  }, [session, status, toggleDropdown])


  return (
    <nav className="bg-blue text-gray-50 dark:text-gray-200 min-w-full z-10">
        <div className="flex items-center relative h-full max-md:justify-between">

          <Link href="/nice" className="flex items-center gap-3 p-2">
            <Image
                src={Logo}
                alt="logo"
                style={{width: '50px', height: '50px'}}
                priority
              />
          </Link>

          {/* MOBILE SCREENS */}
          <button 
            className="md:hidden flex"
            onClick={() => setMobileNavMenu(!mobileNavMenu)}
          >
              {mobileNavMenu ? (
                //className="svg_fill"
                  <svg xmlns="http://www.w3.org/2000/svg" id="Close" className={styles.svg_fill} data-testid="close" viewBox="0 -960 960 960">
                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                  </svg>    
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" id="Hamburger" className={styles.svg_fill} data-testid="hamburger" viewBox="0 -960 960 960">
                    <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                  </svg>
                )}
          </button>

          {mobileNavMenu && (
            <div 
              id="mobile-nav-menu" 
              data-testid="mobile-nav-menu"
              className={`${styles.animate_nav} md:hidden bg-blue absolute min-h-max w-full top-full py-4 px-2`}
            >
              {session?.user ? (
                <ul className="w-full flex flex-col gap-2">
                  <li>
                    <Link 
                      href="/"
                      className={pathname === "/" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/rooms"
                      className={pathname === "/rooms" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      Rooms
                    </Link>
                  </li>
                  <hr className={styles.nav_divider}/>
                  {/* PROFILE INFO */}  
                  <div id="nav-profile-info" className="mx-4 p-4 flex gap-6 items-center">
                    <Link href="/profile">
                      <Image
                        src={session?.user?.image ?? Avatar}
                        width={50}
                        height={50}
                        alt="Avatar"
                        className={session?.user?.image ? 'rounded-full' : 'rounded-full border-2 border-white p-2'}
                        data-testid={session?.user ? "mobile-screen-profileImg-auth" : "mobile-screen-profileImg-nonAuth"}
                      />
                    </Link>
                    <div id="user-info flex flex-col" data-testid="mobile-screen-profileInfo">
                      <h1 className="text-lg" data-testid="profileInfo-name">{session?.user?.name}</h1>
                      <p data-testid="profileInfo-email">{session?.user?.email}</p>
                    </div>
                  </div>
                  {/* PROFILE INFO */}  

                  <li>
                    <Link 
                      href="/profile"
                      className={pathname === "/profile" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/settings"
                      className={pathname === "/settings" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      Settings
                    </Link>
                  </li>
                  {/* PROFILE INFO */}  
                  <button
                        type="button"
                        onClick={() => signOut()}
                        // className="bg-slate-700 py-2 m-4 rounded-lg hover:bg-slate-600 dark:bg-black dark:hover:bg-slate-700 text-lg"
                        className={styles.navM_button}
                      >
                      Sign Out
                  </button>
                </ul>
              ) : (
                <ul className="w-full flex flex-col gap-2">
                  <li>
                    <Link 
                      href="/"
                      className={pathname === "/" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/about"
                      className={pathname === "/rooms" ? styles.navM_link_active : styles.navM_link_item}
                    >
                      About
                    </Link>
                  </li>
                  <hr className={styles.nav_divider}/>

                  {/* PROFILE INFO NOT SIGNED IN */}  
                  <div id="nav-profile-info" className="mx-4 p-4 flex gap-6 items-center">
                    <Link href="/profile">
                      <Image
                        src={session?.user?.image ?? Avatar}
                        width={50}
                        height={50}
                        alt="Avatar"
                        className={session?.user?.image ? 'rounded-full' : 'rounded-full border-2 border-white p-2'}
                        // className="rounded-full border-2 border-white p-2"
                      />
                    </Link>

                    <div id="user-info flex flex-col">
                      <h1 className="text-lg">Annonymous</h1>
                      <p>Please sign in</p>
                    </div>
                  </div>
                  {/* PROFILE INFO NOT SIGNED IN */}  

                  {providers && (
                    Object.values(providers).map(provider => {
                      return <button
                        type="button"
                        key={provider.name}
                        onClick={() => signIn(provider.id)}
                        // className="bg-slate-700 py-2 m-4 rounded-lg hover:bg-slate-600 dark:bg-black dark:hover:bg-slate-700 text-lg"
                        className={styles.navM_button}
                      >
                      Sign In
                      </button>
                    })
                  )}
                </ul>
              )}
            </div>
          )}

          {/* MD-XL SCREENS */}
          <div id="nav-links" className="md:flex hidden flex-1 self-stretch items-center justify-between">

            <div id="nav-links-left" className="h-full">
              <ul className="flex h-full items-center justify-center px-10 gap-2">
                <li className={styles.nav_link_li}>
                  <Link 
                    href="/" 
                    className={pathname === "/" ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link}
                  >
                      Home
                  </Link>
                </li>
                <li className={styles.nav_link_li}>
                  <Link 
                    href="/about" 
                    className={pathname === "/about" ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link}
                  >
                      About
                  </Link>
                </li>
                <li className={styles.nav_link_li}>
                  <Link 
                    href="/something" 
                    className={pathname === "/something" ? `${styles.nav_link} ${styles.nav_link_active}` : styles.nav_link}
                  >
                      Something
                  </Link>
                </li>
              </ul>
            </div>

            <div id="nav-links-right" className="flex gap-5 flex-1 shrink-0 justify-end items-center h-full pr-10 relative">
              {session?.user ? (
                <button
                  type="button"
                  // className="bg-slate-600 p-2 px-5 rounded-lg hover:bg-black dark:bg-black dark:hover:bg-slate-700 transform hover:scale-90 duration-300 ease-in-out"
                  className={styles.nav_btn}
                  onClick={() => signOut()}
                  data-testid="full-screen-signOutBtn"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  {providers && 
                    Object.values(providers).map(provider => {
                      return <button
                        type="button"
                        key={provider.name}
                        onClick={() => signIn(provider.id)}
                        // className="bg-slate-600 p-2 px-5 rounded-lg hover:bg-black dark:bg-black dark:hover:bg-slate-700 transform hover:scale-90 duration-300 ease-in-out"
                        className={styles.nav_btn}
                        data-testid="full-screen-signInBtn"
                      >
                        Sign In
                      </button>
                    })
                  }
                </>
              )}

              <Image
                ref={profileRef}
                src={session?.user?.image ?? Avatar}
                data-testid={session?.user ? "full-screen-profileImg-auth" : "full-screen-profileImg-nonAuth"}
                // data-testid="full-screen-profileImg-authed"
                width={50}
                height={50}
                alt="Avatar"
                className={session?.user?.image ? 'rounded-full' : 'rounded-full border-2 border-white p-2'}
                onClick={() => {
                  if (session?.user) setToggleDropdown(!toggleDropdown);
                }}
              />

              {toggleDropdown && (
                <div 
                  ref={dropdownRef}
                  id="dropdown" 
                  data-testid="full-screen-dropdown"
                  className="absolute right-10 top-[70px] rounded-lg min-w-[240px] bg-white dark:bg-[#363636] shadow"
                >
                  <ul>
                    <li className={styles.dropdown_list_item}>
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li className={styles.dropdown_list_item}>
                      <Link href="/profile">Settings</Link>
                    </li>
                  </ul>
                </div>
              )}

            </div>
          </div>

        </div>
    </nav>
  )
}

export default Navbar






