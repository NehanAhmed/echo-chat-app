export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Echo Chat",
        url: "https://echochat.app",
        description:
          "Real-time ephemeral chat. Create temporary chat rooms that disappear after 24 hours. No sign-up required.",
        applicationCategory: "Communication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "Organization",
        name: "Echo Chat",
        url: "https://echochat.app",
        logo: "https://echochat.app/logo.png",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
