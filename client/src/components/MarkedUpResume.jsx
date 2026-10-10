import { HandCircle } from "./Marks";

// The landing page illustration: a sample resume marked up the way a reviewer would
export default function MarkedUpResume() {
  return (
    <div className="relative mx-auto w-full max-w-md pt-6 lg:max-w-none" aria-hidden="true">
      <div className="sheet relative rotate-[1.2deg] px-7 pt-9 pb-8 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.25)] sm:px-9">
        <div className="absolute -top-7 right-3 -rotate-6 px-5 py-3 text-accent sm:-right-5">
          <HandCircle className="absolute inset-0 h-full w-full" />
          <span className="font-hand text-5xl leading-none font-semibold">81</span>
          <span className="font-hand text-2xl">/100</span>
        </div>

        <div className="h-3.5 w-36 rounded-[2px] bg-ink/85" />
        <div className="mt-2.5 h-2 w-52 rounded-[2px] bg-line-strong" />

        <p className="eyebrow mt-8">Projects</p>
        <ul className="mt-3 space-y-3.5 text-[13.5px] leading-relaxed text-ink-2">
          <li>
            Built a real-time chat app with <mark className="marker">React</mark> and{" "}
            <mark className="marker">Socket.IO</mark>
          </li>
          <li>
            <span className="line-through decoration-accent decoration-2">Responsible for</span> backend APIs and login
            <span className="mt-0.5 block -rotate-2 font-hand text-xl leading-tight text-accent">
              start with a verb: “Designed…”
            </span>
          </li>
          <li>
            Cut page load time by{" "}
            <span className="underline decoration-accent decoration-wavy decoration-[1.5px] underline-offset-4">40%</span>{" "}
            with code splitting
            <span className="ml-2 inline-block -rotate-3 font-hand text-xl leading-none text-good">nice ✓</span>
          </li>
        </ul>

        <p className="eyebrow mt-7">Skills</p>
        <p className="mt-2.5 text-[13.5px] text-ink-2">
          <mark className="marker">JavaScript</mark> · <mark className="marker">Node.js</mark> ·{" "}
          <mark className="marker">MongoDB</mark> · Git
        </p>
        <p className="mt-1 -rotate-1 font-hand text-xl text-accent">+ TypeScript? testing?</p>

        <p className="eyebrow mt-7">Education</p>
        <div className="mt-3 space-y-2">
          <div className="h-2 w-4/5 rounded-[2px] bg-line" />
          <div className="h-2 w-3/5 rounded-[2px] bg-line" />
        </div>
      </div>
    </div>
  );
}
