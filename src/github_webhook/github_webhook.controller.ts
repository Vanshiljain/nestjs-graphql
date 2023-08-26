import { Controller, Post, Body, Headers } from '@nestjs/common';
import { GithubWebhookService } from './github_webhook.service';
import e from 'express';

@Controller('github-webhook')
export class GithubWebhookController {
  constructor(private readonly webhookService: GithubWebhookService) {}

  @Post('pull-request')
  handlePullRequestEvent(@Headers('x-github-event') eventType: string, @Body() eventPayload: any) {
    console.log('Received GitHub event:', eventType);
    // console.log('Received payload:', eventPayload);
    if (eventType === 'pull_request') {
      this.webhookService.handlePullRequestEvent(eventPayload);
    }
    else if (eventType === 'push') {
      this.webhookService.handlePushEvent(eventPayload, eventType);
    }
    else if (eventType === 'workflow_run') {
      this.webhookService.handleWorkflowRunEvent(eventPayload);
    }
    else if (eventType === 'workflow_job') {
      this.webhookService.handleWorkflowJobEvent(eventPayload);
    }
    return 'Webhook received successfully';
  }
}
