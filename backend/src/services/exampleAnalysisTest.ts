import {
  normalizeRawData,
  analyzeIncident,
  notifyAssignedPerson,
} from "./aiAnalysis";

// Testscenarier med olika datastrukturer från olika företag
if (require.main === module) {
  console.log("🧪 Testar tre scenarier med olika dataformat...\n");
  console.log("=".repeat(60) + "\n");

  (async () => {
    // ========================================
    // SCENARIO 1: AWS CloudWatch format - Database crashed (Anna)
    // ========================================
    console.log("📊 SCENARIO 1: AWS CloudWatch - Database Problem\n");

    const awsData = {
      timestamp: "2024-11-04T16:45:10.789Z",
      source: "cloudwatch",
      severity: "CRITICAL",
      service: "postgres-primary",
      instance: "i-db001primary",
      region: "eu-north-1",
      metric: {
        name: "DatabaseConnections",
        value: 0,
        threshold: 50,
      },
      logs: [
        "CRITICAL: PostgreSQL database server crashed unexpectedly",
        "ERROR: Database connection refused on port 5432",
        "ERROR: Automatic restart failed - manual intervention required",
        "CRITICAL: All application services down due to database failure",
      ],
      tags: {
        environment: "production",
        team: "backend",
        priority: "critical",
      },
    };

    console.log("📥 Normaliserar AWS CloudWatch data...");
    const incident1 = await normalizeRawData(awsData);
    console.log(`✅ Incident: ${incident1.title}`);

    const analysis1 = await analyzeIncident(incident1);
    console.log(`👤 Assigned to: ${analysis1.assignedTo}`);
    console.log(`🎯 Action: ${analysis1.action}`);
    console.log(`💡 ${analysis1.recommendation}`);

    // Skicka Slack-notifikation
    await notifyAssignedPerson(incident1, analysis1);
    console.log();

    console.log("=".repeat(60) + "\n");

    // ========================================
    // SCENARIO 2: Datadog format - API Performance (Johan)
    // ========================================
    console.log("📊 SCENARIO 2: Datadog - API Performance Problem\n");

    const datadogData = {
      event_type: "alert",
      alert_id: "dd-alert-12345",
      created_at: 1730734523,
      host: "api-server-prod-03",
      service_name: "payment-gateway",
      message: "High response time detected on payment API endpoint",
      status: "error",
      monitors: [
        {
          name: "API Response Time",
          query:
            "avg(last_5m):avg:http.response.time{service:payment-gateway} > 2",
          current_value: 5.8,
        },
        {
          name: "CPU Usage",
          query: "avg(last_5m):system.cpu.user{host:api-server-prod-03}",
          current_value: 92.4,
        },
      ],
      error_messages: [
        "[2024-11-04 17:15:23] API gateway response time: 5.8s (threshold: 2s)",
        "[2024-11-04 17:15:45] CPU usage spiked to 92.4% on api-server-prod-03",
        "[2024-11-04 17:16:12] Payment processing slowed down significantly",
        "[2024-11-04 17:16:30] Multiple timeout errors reported by clients",
      ],
      context: {
        env: "production",
        component: "api",
        impact: "high",
      },
    };

    console.log("� Normaliserar Datadog data...");
    const incident2 = await normalizeRawData(datadogData);
    console.log(`✅ Incident: ${incident2.title}`);

    const analysis2 = await analyzeIncident(incident2);
    console.log(`👤 Assigned to: ${analysis2.assignedTo}`);
    console.log(`🎯 Action: ${analysis2.action}`);
    console.log(`💡 ${analysis2.recommendation}\n`);

    console.log("=".repeat(60) + "\n");

    // ========================================
    // SCENARIO 3: Grafana/Prometheus format - Cache Memory (Lisa)
    // ========================================
    console.log("📊 SCENARIO 3: Grafana/Prometheus - Cache Memory Issue\n");

    const grafanaData = {
      title: "Memory Alert - Redis Cache Critical",
      state: "alerting",
      ruleName: "redis_memory_critical",
      evalDate: "2024-11-04T18:30:15Z",
      labels: {
        alertname: "RedisMemoryHigh",
        severity: "warning",
        instance: "redis-cache-01.prod.local:6379",
        job: "redis",
        cluster: "production",
      },
      values: {
        memory_used_bytes: 7516192768,
        memory_max_bytes: 8000000000,
        memory_usage_percent: 93.95,
        evicted_keys: 15420,
        blocked_clients: 8,
      },
      annotations: {
        description: "Redis cache memory usage is critically high at 93.95%",
        summary: "Memory leak suspected in cache layer",
        runbook:
          "Check for memory leaks and consider clearing old cache entries",
      },
      alertMessages: [
        "Memory usage exceeded 90% threshold",
        "Detected potential memory leak in Redis cache",
        "15,420 keys have been evicted in the last hour",
        "8 clients are currently blocked due to memory pressure",
        "Cache performance degraded - increased latency detected",
      ],
    };

    console.log("📥 Normaliserar Grafana/Prometheus data...");
    const incident3 = await normalizeRawData(grafanaData);
    console.log(`✅ Incident: ${incident3.title}`);

    const analysis3 = await analyzeIncident(incident3);
    console.log(`👤 Assigned to: ${analysis3.assignedTo}`);
    console.log(`🎯 Action: ${analysis3.action}`);
    console.log(`💡 ${analysis3.recommendation}\n`);

    console.log("=".repeat(60) + "\n");

    // ========================================
    // SCENARIO 4: Custom JSON format - Security/SSL Issue (AI Assistant)
    // ========================================
    console.log(
      "📊 SCENARIO 4: Custom Monitoring - Security Certificate Issue\n"
    );

    const customSecurityData = {
      alert_timestamp: "2024-11-04T19:00:00.000Z",
      notification_type: "security_warning",
      affected_domains: [
        "app.example.com",
        "api.example.com",
        "admin.example.com",
      ],
      issue_category: "ssl_certificate",
      severity_level: "high",
      details: {
        certificate_expiry_date: "2024-11-11T23:59:59Z",
        days_remaining: 7,
        certificate_issuer: "Let's Encrypt Authority X3",
        domains_affected: 3,
        auto_renewal_failed: true,
        last_renewal_attempt: "2024-11-01T03:00:00Z",
      },
      diagnostic_info: [
        "SSL certificate expires in 7 days for 3 production domains",
        "Automatic renewal process failed on 2024-11-01",
        "Certificate validation errors detected in monitoring",
        "Users may see security warnings after expiry",
        "Manual intervention required - auto-renewal blocked by rate limit",
      ],
      recommended_actions: [
        "Manually renew SSL certificate",
        "Update DNS records if needed",
        "Verify certificate installation across all servers",
      ],
      system_metadata: {
        monitoring_tool: "custom_security_scanner",
        infrastructure: "multi-cloud",
        compliance_impact: "high",
      },
    };

    console.log("📥 Normaliserar Custom Security data...");
    const incident4 = await normalizeRawData(customSecurityData);
    console.log(`✅ Incident: ${incident4.title}`);

    const analysis4 = await analyzeIncident(incident4);
    console.log(`👤 Assigned to: ${analysis4.assignedTo}`);
    console.log(`🎯 Action: ${analysis4.action}`);
    console.log(`💡 ${analysis4.recommendation}\n`);

    console.log("=".repeat(60));
    console.log("✅ Alla tester slutförda!");
  })();
}
