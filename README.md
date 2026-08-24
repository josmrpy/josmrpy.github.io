# josmr.py | Personal Portfolio

Hello, World! This is the personal portfolio of Josimar Madrigal. I'm a Costa Rican Computer Science enthusiast, technical student, Scout, and builder of projects across programming, accessibility, networking, education, civic participation, and robotics.

**Live website:** [josmrpy.github.io](https://josmrpy.github.io)

The site is a static, responsive portfolio with an interactive playground. It is organized into the following sections:

## Portfolio Sections

### Home (`#home`)

- Hero introduction with current highlights and a featured sumobot image.
- Click the sumobot to open a menu with featured links to **PJGYS 2026**, **Moody**, GitHub, LinkedIn, and Instagram.
- Current highlights include being a Top 5 National STEM Fair finalist, the developer of Moody, Cisco Networking Academy certification, Stanford Code in Place graduation, and the Youth Ambassadors Program exchange.

### About (`#about`)

- Personal background, interests, and motivation for building technology that solves real problems.
- Quick facts covering location, education, languages, and areas of work.

### Projects (`#projects`)

- **Moody: Colors That Speak:** AAC communication app using ARASAAC pictograms, with an ESP32 wearable prototype for expressing emotional states. Top 5 nationally at ExpoTécnica 2025.
- **PJGYS 2026:** Web platform for organizing and publishing 11 legislative proposals, including PDF viewing, search, filtering, and progress tracking.
- **Sumobot: Equipo BMO:** Autonomous ESP32-based sumo robot programmed with CircuitPython and presented at two editions of Maker Faire San José.
- **Aion:** Student-led platform connecting a school community of 1,000+ learners with academic and leadership opportunities.
- **Jasiel's PytoClicker:** Python and Tkinter autoclicker with configurable clicking, hotkeys, and a class-based architecture.

### Experience & Achievements (`#experience`)

The timeline includes civic participation, STEM competitions, intercultural exchange, youth advocacy, student leadership, Scouting, and volunteering as a Stanford Code in Place mentor. It also includes roles as Vice President of the Assembly of Representatives and President of the Student Electoral Tribunal at CTP Limón.

### Skills (`#skills`)

- **Programming & Software:** Python, CircuitPython, Lua, application development, debugging, and UI/interaction design.
- **Networks & Systems:** Network configuration, TCP/IP, subnetting, Cisco networking, troubleshooting, Windows, and Linux.
- **Hardware & Robotics:** ESP32, embedded systems, sensors, electronics, prototyping, and robotics.
- **Tools & Productivity:** Git, GitHub, VS Code, Thonny, Cisco Packet Tracer, Microsoft Office, and AI-assisted productivity tools.

### Education (`#education`)

- Technical Diploma in Network Configuration, Communications Support & Operating Systems at Colegio Técnico Profesional de Limón, expected December 2026.
- High School Diploma at Colegio Técnico Profesional de Limón, expected December 2026.
- Access Microscholarship Program through Tecnológico de Costa Rica and the U.S. Embassy, completed April 2026.
- Expandable list of 14 certifications, including Cisco networking, Python, cybersecurity, data science, AI, project management, Scrum, and Stanford Code in Place.

### Contact (`#contact`)

Direct contact buttons for GitHub, LinkedIn, and Instagram.

## Interactive Playground (`#playground`)

The playground uses tabs to keep the interactive tools together:

### Binary Counter

- Click individual bits in an 8-bit byte to toggle them.
- Shows the current decimal value from 0 to 255 and its binary representation.
- Controls for incrementing, decrementing, and resetting the value.

### Note Cards

- Create cards with an optional title and text body.
- Cards are stored in the browser using `localStorage`; they are not persisted on a server.
- Generate shareable links containing an encoded note and save notes shared through a link.
- Copy links to the clipboard or fall back to a prompt when clipboard access is unavailable.

### Tower of Hanoi

- Click a peg to pick up its top disk, then click another peg to move it.
- Choose between 3, 4, or 5 disks.
- Invalid moves are prevented and the move counter reports when the puzzle is solved.

### Subnetting Cheat Sheet and Calculator

- Reference cards for octet rules, private address ranges, and subnetting formulas.
- Automatically generated CIDR reference table from `/0` to `/32`, including masks, block sizes, and usable hosts.
- IPv4 calculator for network, broadcast, subnet mask, wildcard mask, first and last usable addresses, usable hosts, and block size.
- Validates IPv4 input and handles `/31` and `/32` networks separately.

### Roblox Games Carousel

- Carousel with arrow controls and clickable dots.
- Links to the official Roblox pages for **Towers of Hanoi** and **Robloxian Physics Binary Counter**.
- Game entries are maintained in the `ROBLOX_GAMES` array in `script.js`.

## Project Structure

```text
index.html   Main portfolio markup and content
styles.css   Responsive visual design and layout
script.js    Playground interactions and carousel data
thumbs/      Thumbnail assets for featured links
```

This repository is the source for the main [josmrpy.github.io](https://josmrpy.github.io) GitHub Pages site.
