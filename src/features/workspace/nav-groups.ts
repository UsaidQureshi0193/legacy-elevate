import {
  AssistantIcon,
  ExpensesIcon,
  InvoiceScanIcon,
  OverviewIcon,
  ProductsIcon,
  PurchasesIcon,
  SalesIcon,
  SuppliersIcon,
} from "@/components/icons";

export type NavItem = {
  href: string;
  label: string;
  Icon: typeof OverviewIcon;
  exact?: boolean;
};
export type NavGroup = { label: string; items: NavItem[] };

/** Overview and Invoices are direct links; the other groups become dropdowns. */
export function getNav(base: string): { overview: NavItem; invoices: NavItem; groups: NavGroup[] } {
  return {
    overview: { href: base, label: "Overview", Icon: OverviewIcon, exact: true },
    invoices: { href: `${base}/invoices`, label: "Invoices", Icon: InvoiceScanIcon },
    groups: [
      {
        label: "Records",
        items: [
          { href: `${base}/products`, label: "Products & Stock", Icon: ProductsIcon },
          { href: `${base}/sales`, label: "Sales", Icon: SalesIcon },
          { href: `${base}/expenses`, label: "Expenses", Icon: ExpensesIcon },
        ],
      },
      {
        label: "Buying",
        items: [
          { href: `${base}/purchases`, label: "Purchases", Icon: PurchasesIcon },
          { href: `${base}/suppliers`, label: "Suppliers", Icon: SuppliersIcon },
        ],
      },
      {
        label: "Ask AI",
        items: [
          { href: `${base}/assistant`, label: "AI Business Assistant", Icon: AssistantIcon },
          { href: `${base}/forecast`, label: "Demand & Sales Forecast", Icon: OverviewIcon },
          { href: `${base}/marketing`, label: "AI Marketing Assistant", Icon: SalesIcon },
        ],
      },
    ],
  };
}

export function isActive(pathname: string, item: NavItem): boolean {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
