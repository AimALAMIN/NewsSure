from django.db import models

class NewsQuery(models.Model):
    url = models.URLField(max_length=500, blank=True, null=True)
    text_content = models.TextField(blank=True, null=True)
    
    # Results from your scripts
    credibility_score = models.FloatField(default=0.0)
    verdict = models.CharField(max_length=50, default="Pending")
    summary = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Query {self.id} - {self.verdict}"