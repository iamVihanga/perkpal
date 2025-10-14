import React from "react";
import { SectionsSelectT, ContentFieldsSelectT } from "@/lib/zod/pages.zod";
import { ContentFieldRenderer } from "./content-field-renderer";

interface PageSectionProps {
  section: SectionsSelectT & {
    fields?: ContentFieldsSelectT[];
  };
  className?: string;
}

export function PageSection({ section, className }: PageSectionProps) {
  const { title, description, fields = [] } = section;

  return (
    <section className={className} data-section-id={section.id}>
      {/* Section Header */}
      {(title || description) && (
        <div className="mb-8">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Section Content */}
      <div className="space-y-6">
        {fields.map((field) => (
          <ContentFieldRenderer
            key={field.id}
            field={field}
            className="content-field"
          />
        ))}
      </div>
    </section>
  );
}

// Specialized section components for common patterns
export function HeroSection({ section }: PageSectionProps) {
  const fields = section.fields || [];
  const fieldsByKey = fields.reduce((acc, field) => {
    acc[field.key] = field;
    return acc;
  }, {} as Record<string, ContentFieldsSelectT>);

  const heroImage =
    fieldsByKey["hero_image"] || fieldsByKey["background_image"];
  const heroTitle = fieldsByKey["hero_title"] || fieldsByKey["title"];
  const heroSubtitle = fieldsByKey["hero_subtitle"] || fieldsByKey["subtitle"];
  const heroButton = fieldsByKey["hero_button"] || fieldsByKey["cta_button"];

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <ContentFieldRenderer
            field={heroImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        {heroTitle && (
          <ContentFieldRenderer
            field={heroTitle}
            className="text-5xl md:text-6xl font-bold mb-6"
          />
        )}
        {heroSubtitle && (
          <ContentFieldRenderer
            field={heroSubtitle}
            className="text-xl md:text-2xl mb-8 opacity-90"
          />
        )}
        {heroButton && (
          <ContentFieldRenderer
            field={heroButton}
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          />
        )}
      </div>
    </section>
  );
}

export function FeaturesSection({ section }: PageSectionProps) {
  const fields = section.fields || [];

  // Group feature fields (assuming they're named like feature_1_title, feature_1_description, etc.)
  const featureGroups = fields.reduce((acc, field) => {
    const match = field.key.match(/^feature_(\d+)_(.+)$/);
    if (match) {
      const [, index, type] = match;
      if (!acc[index]) acc[index] = {};
      acc[index][type] = field;
    }
    return acc;
  }, {} as Record<string, Record<string, ContentFieldsSelectT>>);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {section.title && (
          <h2 className="text-3xl font-bold text-center mb-12">
            {section.title}
          </h2>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(featureGroups).map(([index, feature]) => (
            <div key={index} className="text-center">
              {feature.icon && (
                <ContentFieldRenderer
                  field={feature.icon}
                  className="w-16 h-16 mx-auto mb-4"
                />
              )}
              {feature.title && (
                <ContentFieldRenderer
                  field={feature.title}
                  className="text-xl font-semibold mb-2"
                />
              )}
              {feature.description && (
                <ContentFieldRenderer
                  field={feature.description}
                  className="text-muted-foreground"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
