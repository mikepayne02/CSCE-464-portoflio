.PHONY: all astro resume clean

CURRENT_YEAR := $(shell date +%Y)
AUTHOR_NAME := MichaelPayne

OUTPUT_DIR := resume/dist
RESUME_BASENAME := $(AUTHOR_NAME)_Resume_$(CURRENT_YEAR)

RESUME_PDF := $(OUTPUT_DIR)/$(RESUME_BASENAME).pdf
RESUME_HTML := $(OUTPUT_DIR)/$(RESUME_BASENAME).html

all: astro resume

astro:
	deno task build

resume: $(RESUME_PDF) $(RESUME_HTML)

$(RESUME_PDF): resume/resume.md resume/resume.css resume/resume.html
	mkdir -p $(OUTPUT_DIR)
	pandoc $< -o $@ --pdf-engine=weasyprint --template=resume/resume.html --css resume/resume.css

$(RESUME_HTML): resume/resume.md resume/resume.css resume/resume.html
	mkdir -p $(OUTPUT_DIR)
	pandoc $< -o $@ --template=resume/resume.html --css resume/resume.css --embed-resources --standalone --to html5

clean:
	rm -rf $(OUTPUT_DIR)