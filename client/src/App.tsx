import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";
import Videos from "@/pages/videos";
import Faqs from "@/pages/faqs";
import Customers from "@/pages/customers";
import Subscriptions from "@/pages/subscriptions";
import Scripts from "@/pages/scripts";
import CustomerLogin from "@/pages/customer-login";
import CustomerDashboard from "@/pages/customer-dashboard";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";
import type { Settings as SettingsType } from "@shared/schema";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/dashboard" component={Dashboard}/>
      <Route path="/settings" component={Settings}/>
      <Route path="/videos" component={Videos}/>
      <Route path="/faqs" component={Faqs}/>
      <Route path="/customers" component={Customers}/>
      <Route path="/subscriptions" component={Subscriptions}/>
      <Route path="/scripts" component={Scripts}/>
      <Route path="/customer/login" component={CustomerLogin}/>
      <Route path="/customer/dashboard" component={CustomerDashboard}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: settings } = useQuery<SettingsType>({
    queryKey: ["/api/settings"],
  });

  useEffect(() => {
    if (settings?.siteName) {
      document.title = settings.siteName;
    }

    if (settings?.faviconPath) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.rel = 'icon';
      link.href = settings.faviconPath;
      if (!document.querySelector("link[rel~='icon']")) {
        document.head.appendChild(link);
      }
    }

    // Facebook Pixel
    if (settings?.facebookPixel) {
      // Remover script anterior se existir
      const oldFbScript = document.getElementById('facebook-pixel');
      if (oldFbScript) {
        oldFbScript.remove();
      }

      // Adicionar Facebook Pixel
      const fbScript = document.createElement('script');
      fbScript.id = 'facebook-pixel';
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixel}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);

      // Adicionar noscript para Facebook Pixel
      const oldFbNoscript = document.getElementById('facebook-pixel-noscript');
      if (oldFbNoscript) {
        oldFbNoscript.remove();
      }

      const fbNoscript = document.createElement('noscript');
      fbNoscript.id = 'facebook-pixel-noscript';
      fbNoscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.facebookPixel}&ev=PageView&noscript=1"/>`;
      document.body.appendChild(fbNoscript);
    }

    // Google Analytics
    if (settings?.googleAnalytics) {
      // Remover scripts anteriores se existirem
      const oldGaScript1 = document.getElementById('google-analytics-script');
      const oldGaScript2 = document.getElementById('google-analytics-init');
      if (oldGaScript1) oldGaScript1.remove();
      if (oldGaScript2) oldGaScript2.remove();

      // Adicionar Google Analytics (GA4 ou Universal Analytics)
      if (settings.googleAnalytics.startsWith('G-')) {
        // Google Analytics 4
        const gaScript1 = document.createElement('script');
        gaScript1.id = 'google-analytics-script';
        gaScript1.async = true;
        gaScript1.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalytics}`;
        document.head.appendChild(gaScript1);

        const gaScript2 = document.createElement('script');
        gaScript2.id = 'google-analytics-init';
        gaScript2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.googleAnalytics}');
        `;
        document.head.appendChild(gaScript2);
      } else if (settings.googleAnalytics.startsWith('UA-')) {
        // Universal Analytics
        const gaScript = document.createElement('script');
        gaScript.id = 'google-analytics-script';
        gaScript.async = true;
        gaScript.src = `https://www.google-analytics.com/analytics.js`;
        document.head.appendChild(gaScript);

        const gaInit = document.createElement('script');
        gaInit.id = 'google-analytics-init';
        gaInit.innerHTML = `
          window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
          ga('create', '${settings.googleAnalytics}', 'auto');
          ga('send', 'pageview');
        `;
        document.head.appendChild(gaInit);
      }
    }
  }, [settings]);

  return (
    <TooltipProvider>
      <Toaster />
      <Router />
    </TooltipProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
