import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

type DynamicInfoProps = {
  avatar?: string;
  name?: string;
  role?: string;
  status?: string;
  xUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
};

type IconName = "x" | "linkedin" | "github" | "website";

function SocialIcon({ name }: { name: IconName }) {
  if (name === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.8 2H22l-7 8 8.2 12h-6.4l-5-7.2L5.5 22H2.3l8-9.2L2.4 2h6.6l4.5 6.5L18.8 2Zm-1.1 17.9h1.8L8 4H6.1l11.6 15.9Z" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.5 8.3H3.2V21h3.3V8.3ZM4.8 3A1.9 1.9 0 1 0 4.8 6.8 1.9 1.9 0 0 0 4.8 3ZM21 13.7c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.3H9.3V21h3.3v-6.3c0-1.7.3-3.3 2.4-3.3 2 0 2.1 1.9 2.1 3.4V21H21v-7.3Z" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.3-2.3-.3-4.7-1.1-4.7-5A4 4 0 0 1 6.5 8.5c-.1-.3-.5-1.3.1-2.7 0 0 .9-.3 2.9 1.1A10 10 0 0 1 12 6.6c.9 0 1.7.1 2.5.3 2-1.4 2.9-1.1 2.9-1.1.6 1.4.2 2.4.1 2.7a4 4 0 0 1 1.1 2.8c0 3.9-2.4 4.7-4.7 5 .4.3.7 1 .7 2V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3ZM5 5h6v2H5v12h12v-6h2v8H3V5h2Z" />
    </svg>
  );
}

export function DynamicInfo({
  avatar = "/fxrken-logo-3d.png",
  name = "FXRKENART",
  role = "Digital Artist",
  status = "Available",
  xUrl = "https://x.com/",
  linkedinUrl = "https://linkedin.com/",
  githubUrl = "https://github.com/forkenyk",
  websiteUrl = "https://fxrkenart.forkenyk-work.workers.dev/",
}: DynamicInfoProps) {
  const [time, setTime] = useState("");
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);

  const expanded = hovered || pinned;

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(new Date()),
      );
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;
    setPinned((current) => !current);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setPinned((current) => !current);
    }

    if (event.key === "Escape") {
      setPinned(false);
    }
  };

  const links: Array<{
    label: string;
    url: string;
    icon: IconName;
  }> = [
    { label: "X", url: xUrl, icon: "x" },
    { label: "LinkedIn", url: linkedinUrl, icon: "linkedin" },
    { label: "GitHub", url: githubUrl, icon: "github" },
    { label: "Website", url: websiteUrl, icon: "website" },
  ];

  return (
    <aside
      className={`dynamic-info${expanded ? " dynamic-info--expanded" : ""}`}
      aria-expanded={expanded}
      tabIndex={0}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="dynamic-info__main">
        <div className="dynamic-info__top">
          <div className="dynamic-info__avatar">
            <img src={avatar} alt="" draggable={false} />
          </div>

          <div className="dynamic-info__identity">
            <strong>{name}</strong>
            <span>{role}</span>
          </div>

          <time className="dynamic-info__time">{time}</time>
        </div>

        <div className="dynamic-info__bottom" aria-hidden={!expanded}>
          <nav className="dynamic-info__socials" aria-label="Social links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                tabIndex={expanded ? 0 : -1}
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </nav>

          <div className="dynamic-info__status">
            <span className="dynamic-info__status-dot" />
            <span>{status}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}