import { EmailCapture } from "@/components/EmailCapture";
import { DemoPlayer } from "@/components/DemoPlayer";
import { LogoStrip } from "@/components/LogoStrip";
import { FooterNav } from "@/components/FooterNav";

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col items-center px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
      <section className="flex w-full max-w-3xl flex-col items-center text-center">
        <h1 className="text-display text-balance">
          Before you reset their MFA, send one link: government ID plus live
          selfie, verified in under 60 seconds, logged.
        </h1>
        <p className="text-body mt-5 max-w-2xl text-balance text-slate-600">
          For the IT lead on Microsoft 365 or Okta who approves every reset
          personally: replace the questions you improvise on each call with a
          check you can show an auditor.
        </p>
        <div className="mt-8 w-full max-w-xl">
          <EmailCapture />
        </div>
      </section>

      <section className="mt-12 w-full sm:mt-16" aria-label="Product demo">
        <DemoPlayer />
        <p className="text-body mt-5 text-center">
          $4 per check. No contract, no minimum, no sales call.
        </p>
      </section>

      <LogoStrip />

      <FooterNav />
    </main>
  );
}
