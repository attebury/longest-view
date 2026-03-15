---
layout: layouts/page.njk
title: Blog
permalink: /blog.html
---

<p><a href="/tags/">Tags</a> · <a href="/archive/">Archive</a></p>
<ul>
  {% for post in collections.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      — {{ post.date | date("yyyy-MM-dd") }}
    </li>
  {% endfor %}
</ul>

