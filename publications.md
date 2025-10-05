---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---

{% assign journal_pubs = site.publications | sort: 'date' | reverse %}
{% assign talks = site.talks | sort: 'date' | reverse %}

<h2>Journal Articles</h2>
{% if journal_pubs.size > 0 %}
  {% assign current_year = "" %}
  {% for pub in journal_pubs %}
    {% assign year = pub.date | date: "%Y" %}
    {% if year != current_year %}
      {% unless forloop.first %}</ul>{% endunless %}
      <h3>{{ year }}</h3>
      <ul>
      {% assign current_year = year %}
    {% endif %}
    <li>
      <a href="{{ pub.url | relative_url }}">{{ pub.title }}</a>
      {% if pub.venue %} — {{ pub.venue }}{% endif %}
      {% if pub.date %}
        {% assign pub_month_day = pub.date | date: "%B %d" %}
        {% if pub_month_day != "" %} ({{ pub_month_day }}){% endif %}
      {% endif %}
    </li>
    {% if forloop.last %}</ul>{% endif %}
  {% endfor %}
{% else %}
  <p>No journal articles available yet.</p>
{% endif %}

<h2>Conference Talks</h2>
{% if talks.size > 0 %}
  {% assign current_year = "" %}
  {% for talk in talks %}
    {% assign year = talk.date | date: "%Y" %}
    {% if year != current_year %}
      {% unless forloop.first %}</ul>{% endunless %}
      <h3>{{ year }}</h3>
      <ul>
      {% assign current_year = year %}
    {% endif %}
    <li>
      <a href="{{ talk.url | relative_url }}">{{ talk.title }}</a>
      {% if talk.venue %} — {{ talk.venue }}{% endif %}
      {% assign talk_meta = "" %}
      {% if talk.location %}
        {% assign talk_meta = talk.location %}
      {% endif %}
      {% if talk.date %}
        {% assign talk_date = talk.date | date: "%B %d" %}
        {% if talk_meta != "" %}
          {% assign talk_meta = talk_meta | append: ", " | append: talk_date %}
        {% else %}
          {% assign talk_meta = talk_date %}
        {% endif %}
      {% endif %}
      {% if talk_meta != "" %} ({{ talk_meta }}){% endif %}
    </li>
    {% if forloop.last %}</ul>{% endif %}
  {% endfor %}
{% else %}
  <p>No conference talks available yet.</p>
{% endif %}
