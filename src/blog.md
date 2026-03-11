---
layout: layouts/page.njk
title: Blog
permalink: /blog.html
---

<ul>
  {% for post in collections.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a>
      — {{ post.date | date("yyyy-MM-dd") }}
    </li>
  {% endfor %}
</ul>

