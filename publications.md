---
layout: single
title: "Publications"
permalink: /publications/
author_profile: true
---

{% assign journal_pubs = site.publications | sort: 'date' | reverse %}
{% assign conference_talks = site.talks | sort: 'date' | reverse %}

<section id="journal-articles" aria-labelledby="journal-articles-heading">
  <h2 id="journal-articles-heading">Journal Articles</h2>
  {% if journal_pubs.size > 0 %}
    {% assign grouped_journals = journal_pubs | group_by_exp: 'pub', "pub.date | date: '%Y'" %}
    {% assign grouped_journals = grouped_journals | sort: 'name' | reverse %}
    {% for year in grouped_journals %}
      {% assign publications_for_year = year.items | sort: 'date' | reverse %}
      <h3 id="journal-{{ year.name | default: 'undated' | slugify }}">{{ year.name | default: 'Undated' }}</h3>
      <ul class="publication-list">
      {% for pub in publications_for_year %}
        <li>
          <a href="{{ pub.url | relative_url }}">{{ pub.title }}</a>
          {% if pub.venue %}
            <span class="pub-venue"> — {{ pub.venue }}</span>
          {% endif %}
          {% if pub.date %}
            <span class="pub-date"> ({{ pub.date | date: "%B %d, %Y" }})</span>
          {% endif %}
          {% if pub.citation %}
            <div class="pub-citation">{{ pub.citation | markdownify | strip }}</div>
          {% endif %}
        </li>
      {% endfor %}
      </ul>
    {% endfor %}
  {% else %}
    <p>No journal articles available yet.</p>
  {% endif %}
</section>

<section id="conference-talks" aria-labelledby="conference-talks-heading">
  <h2 id="conference-talks-heading">Conference Talks</h2>
  {% if conference_talks.size > 0 %}
    {% assign grouped_talks = conference_talks | group_by_exp: 'talk', "talk.date | date: '%Y'" %}
    {% assign grouped_talks = grouped_talks | sort: 'name' | reverse %}
    {% for year in grouped_talks %}
      {% assign talks_for_year = year.items | sort: 'date' | reverse %}
      <h3 id="talks-{{ year.name | default: 'undated' | slugify }}">{{ year.name | default: 'Undated' }}</h3>
      <ul class="talk-list">
      {% for talk in talks_for_year %}
        <li>
          <a href="{{ talk.url | relative_url }}">{{ talk.title }}</a>
          {% if talk.venue %}
            <span class="talk-venue"> — {{ talk.venue }}</span>
          {% endif %}
          {% assign talk_meta = '' %}
          {% if talk.location %}
            {% assign talk_meta = talk.location %}
          {% endif %}
          {% if talk.date %}
            {% assign talk_date = talk.date | date: "%B %d, %Y" %}
            {% if talk_meta != '' %}
              {% assign talk_meta = talk_meta | append: ", " | append: talk_date %}
            {% else %}
              {% assign talk_meta = talk_date %}
            {% endif %}
          {% endif %}
          {% if talk_meta != '' %}
            <span class="talk-meta"> ({{ talk_meta }})</span>
          {% endif %}
          {% if talk.excerpt %}
            <div class="talk-description">{{ talk.excerpt | markdownify | strip }}</div>
          {% endif %}
        </li>
      {% endfor %}
      </ul>
    {% endfor %}
  {% else %}
    <p>No conference talks available yet.</p>
  {% endif %}
</section>
