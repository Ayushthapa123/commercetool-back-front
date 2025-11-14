import Script from "next/script";

const otDataDomainScript =
  process.env.OT_DATA_DOMAIN_SCRIPT ??
  "018dfb38-1b45-7aec-8418-c7ad13e9b8e8-test";

export function OnetrustScriptInclude() {
  return (
    <>
      <Script
        src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js"
        type="text/javascript"
        data-domain-script={otDataDomainScript}
        strategy="afterInteractive"
      />
      <Script
        id="optanon-wrapper"
        type="text/javascript"
        strategy="afterInteractive"
      >
        {`
          function OptanonWrapper() {                
            if(OnetrustActiveGroups.includes("C0002")){
              dtrum.enable()
            } 
          }
        `}
      </Script>
    </>
  );
}
