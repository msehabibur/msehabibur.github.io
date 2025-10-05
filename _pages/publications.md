---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true     # Enables left sidebar
# Do NOT add: classes: wide (that hides the sidebar)
# Optional: if you want a left menu too:
# sidebar:
#   nav: main
---

{% include base_path %}

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
