---
layout: page
title: "Publications"
permalink: /publications/
---

{% assign pubs = site.publications | sort: 'date' | reverse %}

<ul>
{% for pub in pubs %}
  <li>
    <a href="{{ pub.url | relative_url }}">{{ pub.title }}</a>
    {% if pub.venue %} — {{ pub.venue }}{% endif %}
    {% if pub.date %} ({{ pub.date | date: "%Y" }}){% endif %}
  </li>
{% endfor %}
</ul>
