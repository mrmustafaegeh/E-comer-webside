import ContactForm from "../../Component/contact/ContactForm";
import { Container, Section, SectionHeader, Card } from "../../Component/ui/primitives";

export const metadata = {
  title: "Contact Us - QuickQart",
  description: "Get in touch with the QuickQart team for support or inquiries.",
};

export default function ContactPage() {
  return (
    <Section className="border-t border-[var(--border)]">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              label="Contact"
              title="Get in touch"
              description="Our support team is available for orders, product questions, and partnerships."
            />
            <div className="space-y-6 text-sm text-[var(--text-muted)]">
              <div>
                <p className="font-medium text-[var(--text)]">Email</p>
                <p>hello@quickqart.com</p>
              </div>
              <div>
                <p className="font-medium text-[var(--text)]">Address</p>
                <p>One Apple Park Way, Cupertino, CA 95014</p>
              </div>
            </div>
          </div>

          <Card className="rounded-2xl p-6 md:p-8">
            <ContactForm />
          </Card>
        </div>
      </Container>
    </Section>
  );
}
