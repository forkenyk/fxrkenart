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
        <path d="M4 4 20 20M20 4 4 20" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 9v9M6 6.2v.1M10 18v-5c0-2.2 1.4-3.7 3.5-3.7S17 10.8 17 13v5M10 9.5V18" />
      </svg>
    );
  }

  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 19c-4.5 1.4-4.5-2.5-6-3m12 5v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.5-1.4 5.5-6A4.6 4.6 0 0 0 19 6c.3-.8.3-2-.1-3 0 0-1.1-.4-3.6 1.3a12.5 12.5 0 0 0-6.6 0C6.2 2.6 5.1 3 5.1 3c-.4 1-.4 2.2-.1 3a4.6 4.6 0 0 0-1 3.5c0 4.6 2.7 5.7 5.5 6-.5.5-.6 1.1-.5 2V21" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" />
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const expanded = hovered || mobileOpen;

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

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;

    if (window.matchMedia("(hover: none)").matches) {
      setMobileOpen((current) => !current);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setMobileOpen((current) => !current);
    }

    if (event.key === "Escape") {
      setMobileOpen(false);
      setHovered(false);
    }
  };

  const links: Array<{
    label: string;
    href: string;
    icon: IconName;
  }> = [
    { label: "X", href: xUrl, icon: "x" },
    { label: "LinkedIn", href: linkedinUrl, icon: "linkedin" },
    { label: "GitHub", href: githubUrl, icon: "github" },
    { label: "Website", href: websiteUrl, icon: "website" },
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
      <span
        className="dynamic-info__corner dynamic-info__corner--left"
        aria-hidden="true"
      >
        <span />
      </span>

      <div className="dynamic-info__main">
        <div className="dynamic-info__top">
          <div className="dynamic-info__user">
            <div className="dynamic-info__avatar">
              <img src={avatar} alt="" draggable={false} />
            </div>

            <div className="dynamic-info__identity">
              <strong>{name}</strong>
              <span>{role}</span>
            </div>
          </div>

          <time className="dynamic-info__time">{time}</time>
        </div>

        <div className="dynamic-info__bottom" aria-hidden={!expanded}>
          <nav className="dynamic-info__socials" aria-label="Social links">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
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
            <span className="dynamic-info__status-dot">
              <span />
              <span />
            </span>

            <span>{status}</span>
          </div>
        </div>
      </div>

      <span
        className="dynamic-info__corner dynamic-info__corner--right"
        aria-hidden="true"
      >
        <span />
      </span>
    </aside>
  );
}